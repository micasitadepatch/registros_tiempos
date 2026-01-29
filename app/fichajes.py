from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
# CAMBIO: Importaciones absolutas
from app import models, schemas
from app.database import SessionLocal

router = APIRouter(prefix="/fichajes", tags=["fichajes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.FichajeOut, status_code=status.HTTP_201_CREATED)
def create_fichaje(fichaje: schemas.FichajeCreate, db: Session = Depends(get_db)):
    db_fichaje = models.Fichaje(**fichaje.dict(), timestamp=datetime.utcnow())
    db.add(db_fichaje)
    db.commit()
    db.refresh(db_fichaje)
    return db_fichaje

@router.get("/by_user/{user_id}", response_model=List[schemas.FichajeOut])
def get_fichajes_by_user(user_id: int, db: Session = Depends(get_db)):
    fichajes = db.query(models.Fichaje).filter(models.Fichaje.user_id == user_id).all()
    return fichajes
