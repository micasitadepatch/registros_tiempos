from fastapi import APIRouter, Depends, HTTPException, status, Path, Body
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import SessionLocal
from .auth import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        name=user.name,
        password_hash=hashed_password,
        role=user.role,
        schedule=user.schedule
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int = Path(..., gt=0), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.username != db_user.username:
        exists = db.query(models.User).filter(models.User.username == user.username).first()
        if exists:
            raise HTTPException(status_code=400, detail="El nuevo username ya existe")
    db_user.username = user.username
    db_user.name = user.name
    db_user.role = user.role
    db_user.password_hash = get_password_hash(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.patch("/{user_id}", response_model=schemas.UserOut)
def patch_user(user_id: int, datos: dict = Body(...), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for campo, valor in datos.items():
        if campo == "password":
            db_user.password_hash = get_password_hash(valor)
        elif hasattr(db_user, campo):
            setattr(db_user, campo, valor)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(db_user)
    db.commit()
    return
