from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    schedule = Column(String, nullable=False, default="10:00-14:00")
    auto_fichaje = Column(Integer, nullable=False, default=1)  # 1=activo, 0=inactivo

class Fichaje(Base):
    __tablename__ = "fichajes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    tipo = Column(String, nullable=False)  # 'entrada' o 'salida'
    user = relationship("User")

# No es necesario 'orm_mode' en modelos SQLAlchemy, pero si lo usas en Pydantic, debe ser 'from_attributes' en schemas.py
