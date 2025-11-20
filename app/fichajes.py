from fastapi import APIRouter, Depends, HTTPException, status, Path, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from datetime import datetime, date, time
from . import models, schemas
from .database import SessionLocal

router = APIRouter(prefix="/fichajes", tags=["fichajes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class FichajeCreate(schemas.BaseModel):
    user_id: int
    tipo: str  # 'entrada' o 'salida'

class FichajeOut(schemas.BaseModel):
    id: int
    user_id: int
    timestamp: datetime
    tipo: str
    class Config:
        orm_mode = True

@router.post("/", response_model=FichajeOut, status_code=status.HTTP_201_CREATED)
def crear_fichaje(fichaje: FichajeCreate, db: Session = Depends(get_db)):
    nuevo = models.Fichaje(
        user_id=fichaje.user_id,
        timestamp=datetime.utcnow(),
        tipo=fichaje.tipo
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[FichajeOut])
def listar_fichajes(db: Session = Depends(get_db)):
    return db.query(models.Fichaje).all()

@router.get("/{fichaje_id}", response_model=FichajeOut)
def get_fichaje(fichaje_id: int = Path(..., gt=0), db: Session = Depends(get_db)):
    fichaje = db.query(models.Fichaje).filter(models.Fichaje.id == fichaje_id).first()
    if not fichaje:
        raise HTTPException(status_code=404, detail="Fichaje no encontrado")
    return fichaje

@router.put("/{fichaje_id}", response_model=FichajeOut)
def update_fichaje(fichaje_id: int, fichaje: FichajeCreate, db: Session = Depends(get_db)):
    db_fichaje = db.query(models.Fichaje).filter(models.Fichaje.id == fichaje_id).first()
    if not db_fichaje:
        raise HTTPException(status_code=404, detail="Fichaje no encontrado")
    db_fichaje.user_id = fichaje.user_id
    db_fichaje.tipo = fichaje.tipo
    db.commit()
    db.refresh(db_fichaje)
    return db_fichaje

@router.patch("/{fichaje_id}", response_model=FichajeOut)
def patch_fichaje(fichaje_id: int, datos: dict = Body(...), db: Session = Depends(get_db)):
    db_fichaje = db.query(models.Fichaje).filter(models.Fichaje.id == fichaje_id).first()
    if not db_fichaje:
        raise HTTPException(status_code=404, detail="Fichaje no encontrado")
    for campo, valor in datos.items():
        if hasattr(db_fichaje, campo):
            setattr(db_fichaje, campo, valor)
    db.commit()
    db.refresh(db_fichaje)
    return db_fichaje

@router.delete("/{fichaje_id}", status_code=204)
def delete_fichaje(fichaje_id: int, db: Session = Depends(get_db)):
    db_fichaje = db.query(models.Fichaje).filter(models.Fichaje.id == fichaje_id).first()
    if not db_fichaje:
        raise HTTPException(status_code=404, detail="Fichaje no encontrado")
    db.delete(db_fichaje)
    db.commit()
    return

from .models import User, Fichaje

def registrar_fichaje_automatico(user: User, db):
    if user.role == 'admin' or user.auto_fichaje != 1:
        return
    hoy = date.today()
    ahora = datetime.now().time()
    # Fichaje de entrada
    hora_inicio = user.schedule.split('-')[0]
    hora_entrada = datetime.strptime(hora_inicio, "%H:%M").time()
    if ahora >= hora_entrada:
        existe_entrada = db.query(Fichaje).filter(and_(Fichaje.user_id == user.id, Fichaje.tipo == 'entrada', Fichaje.timestamp >= datetime.combine(hoy, time(0,0)), Fichaje.timestamp < datetime.combine(hoy, time(23,59,59)))).first()
        if not existe_entrada:
            timestamp_entrada = datetime.combine(hoy, hora_entrada)
            nuevo_entrada = Fichaje(user_id=user.id, timestamp=timestamp_entrada, tipo='entrada')
            db.add(nuevo_entrada)
            db.commit()
            db.refresh(nuevo_entrada)
    # Fichaje de salida
    hora_fin = user.schedule.split('-')[1]
    hora_salida = datetime.strptime(hora_fin, "%H:%M").time()
    if ahora >= hora_salida:
        existe_salida = db.query(Fichaje).filter(and_(Fichaje.user_id == user.id, Fichaje.tipo == 'salida', Fichaje.timestamp >= datetime.combine(hoy, time(0,0)), Fichaje.timestamp < datetime.combine(hoy, time(23,59,59)))).first()
        if not existe_salida:
            timestamp_salida = datetime.combine(hoy, hora_salida)
            nuevo_salida = Fichaje(user_id=user.id, timestamp=timestamp_salida, tipo='salida')
            db.add(nuevo_salida)
            db.commit()
            db.refresh(nuevo_salida)

@router.get("/by_user/{user_id}", response_model=List[FichajeOut])
def fichajes_por_usuario(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        registrar_fichaje_automatico(user, db)
    return db.query(models.Fichaje).filter(models.Fichaje.user_id == user_id).all()

@router.get("/search/", response_model=List[FichajeOut])
def buscar_fichajes(
    user_id: int = Query(None),
    tipo: str = Query(None),
    desde: str = Query(None),
    hasta: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Fichaje)
    if user_id:
        query = query.filter(models.Fichaje.user_id == user_id)
    if tipo:
        query = query.filter(models.Fichaje.tipo == tipo)
    if desde:
        query = query.filter(models.Fichaje.timestamp >= desde)
    if hasta:
        query = query.filter(models.Fichaje.timestamp <= hasta)
    return query.all()

# Nueva función para registrar fichajes automáticos solo si la hora actual ha pasado la hora de entrada/salida

def registrar_fichajes_automaticos_global(db):
    hoy = date.today()
    ahora = datetime.now().time()
    usuarios = db.query(User).filter(User.role != 'admin', User.auto_fichaje == 1).all()
    for user in usuarios:
        # Entrada
        hora_inicio = user.schedule.split('-')[0]
        hora_entrada = datetime.strptime(hora_inicio, "%H:%M").time()
        if ahora >= hora_entrada:
            existe_entrada = db.query(Fichaje).filter(and_(Fichaje.user_id == user.id, Fichaje.tipo == 'entrada', Fichaje.timestamp >= datetime.combine(hoy, time(0,0)), Fichaje.timestamp < datetime.combine(hoy, time(23,59,59)))).first()
            if not existe_entrada:
                timestamp_entrada = datetime.combine(hoy, hora_entrada)
                nuevo_entrada = Fichaje(user_id=user.id, timestamp=timestamp_entrada, tipo='entrada')
                db.add(nuevo_entrada)
                db.commit()
                db.refresh(nuevo_entrada)
        # Salida
        hora_fin = user.schedule.split('-')[1]
        hora_salida = datetime.strptime(hora_fin, "%H:%M").time()
        if ahora >= hora_salida:
            existe_salida = db.query(Fichaje).filter(and_(Fichaje.user_id == user.id, Fichaje.tipo == 'salida', Fichaje.timestamp >= datetime.combine(hoy, time(0,0)), Fichaje.timestamp < datetime.combine(hoy, time(23,59,59)))).first()
            if not existe_salida:
                timestamp_salida = datetime.combine(hoy, hora_salida)
                nuevo_salida = Fichaje(user_id=user.id, timestamp=timestamp_salida, tipo='salida')
                db.add(nuevo_salida)
                db.commit()
                db.refresh(nuevo_salida)

# Endpoint para disparar el registro automático global (puedes llamarlo desde un cron, o manualmente)
@router.post("/auto-fichajes/trigger", status_code=200)
def trigger_auto_fichajes(db: Session = Depends(get_db)):
    registrar_fichajes_automaticos_global(db)
    return {"detail": "Fichajes automáticos procesados"}
