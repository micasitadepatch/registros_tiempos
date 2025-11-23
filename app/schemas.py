from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class UserBase(BaseModel):
    username: str
    name: str
    role: str
    schedule: str = "10:00-14:00"
    auto_fichaje: int = 1

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class FichajeBase(BaseModel):
    user_id: int
    tipo: str

class FichajeCreate(FichajeBase):
    pass

class FichajeOut(FichajeBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True
