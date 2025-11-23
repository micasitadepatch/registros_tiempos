from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from . import models, schemas
from .database import SessionLocal
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    logger.info(f"--- LOGIN ATTEMPT: User '{data.username}' ---")

    user = db.query(models.User).filter(models.User.username == data.username).first()

    if not user:
        logger.warning("--- RESULT: User not found in database. ---")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    logger.info(f"--- DEBUG: User '{user.username}' found in DB. ---")

    is_password_correct = verify_password(data.password, user.password_hash)
    logger.info(f"--- DEBUG: Password verification result for '{data.username}': {is_password_correct} ---")

    if not is_password_correct:
        logger.warning("--- RESULT: Password verification failed. ---")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    logger.info("--- RESULT: Login successful. Creating token. ---")
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserOut.from_orm(user)}
