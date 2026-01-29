from fastapi import FastAPI
from contextlib import asynccontextmanager
from app import models, database
from app.auth import router as auth_router, get_password_hash
from app.fichajes import router as fichajes_router
from app.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import SessionLocal
from app.models import User
import logging
from a2wsgi import ASGIMiddleware
from sqlalchemy import text, inspect
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_initial_data_logic():
    """Lógica de creación de usuarios separada para poder llamarla manualmente"""
    db = SessionLocal()
    logs = []
    try:
        usuarios = [
            {"username": "eva", "name": "Eva Huercano", "password": "0909", "role": "admin", "schedule": "10:00-14:00"},
            {"username": "admin", "name": "Administrador", "password": "0909", "role": "admin", "schedule": "10:00-14:00"},
            {"username": "asera", "name": "Asera Jimenez", "password": "1234", "role": "user", "schedule": "16:00-20:00"}
        ]
        
        creados = []
        for u in usuarios:
            user_exists = db.query(User).filter_by(username=u["username"]).first()
            if not user_exists:
                hashed_password = get_password_hash(u["password"])
                user = User(
                    username=u["username"],
                    name=u["name"],
                    password_hash=hashed_password,
                    role=u["role"],
                    schedule=u["schedule"]
                )
                db.add(user)
                creados.append(u["username"])
        
        if creados:
            db.commit()
            logs.append(f"Usuarios creados: {creados}")
        else:
            logs.append("Usuarios ya existían.")
            
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
    return logs

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando la aplicación...")
    try:
        models.Base.metadata.create_all(bind=database.engine)
        seed_initial_data_logic()
    except Exception as e:
        logger.error(f"Error en lifespan: {e}")
    yield
    logger.info("Cerrando la aplicación...")

# --- CREACIÓN DE LA APP ---
app = FastAPI(lifespan=lifespan)

# --- Configuración de CORS ---
origins = [
    "https://fichajes.micasitadepatch.com",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permitir todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"], # Permitir todas las cabeceras
)

# --- Inclusión de Routers ---
app.include_router(auth_router)
app.include_router(fichajes_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "API FastAPI funcionando correctamente"}

# --- ENDPOINT DE DIAGNÓSTICO MEJORADO ---
@app.get("/test-db")
def test_db_endpoint():
    try:
        db = SessionLocal()
        inspector = inspect(database.engine)
        
        # 1. Verificar conexión
        db.execute(text("SELECT 1"))
        
        # 2. Verificar tablas
        has_users_table = inspector.has_table("users")
        has_fichajes_table = inspector.has_table("fichajes")
        
        # 3. Contar usuarios
        user_count = 0
        if has_users_table:
            user_count = db.query(User).count()
            
        db.close()
        
        return {
            "status_conexion": "OK",
            "tablas": {
                "users_existe": has_users_table,
                "fichajes_existe": has_fichajes_table,
            },
            "datos": {
                "numero_usuarios": user_count
            }
        }
    except Exception as e:
        return {
            "status_conexion": "ERROR",
            "error_type": str(type(e)),
            "error_message": str(e)
        }

# --- ADAPTADOR WSGI ---
application = ASGIMiddleware(app)
