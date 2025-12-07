from fastapi import FastAPI
from contextlib import asynccontextmanager
from . import models, database
from .auth import router as auth_router, get_password_hash
from .fichajes import router as fichajes_router
from .users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal
from .models import User
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_initial_data():
    """
    Inserta los datos iniciales en la base de datos si no existen.
    Esta función es síncrona y se llama desde el evento de arranque.
    """
    logger.info("Verificando la necesidad de poblar la base de datos...")
    db = SessionLocal()
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
                # La función get_password_hash se importa directamente desde 'auth'
                # asegurando que se usa el mismo algoritmo que en el login.
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
            logger.info(f"Usuarios creados: {creados}")
        else:
            logger.info("La base de datos ya estaba poblada. No se realizaron cambios.")
            
    except Exception as e:
        logger.error(f"Error durante el poblamiento de la base de datos: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta ANTES de que la aplicación empiece a aceptar peticiones
    logger.info("Iniciando la aplicación...")
    models.Base.metadata.create_all(bind=database.engine)
    seed_initial_data()
    yield
    # Código que se ejecuta cuando la aplicación se está cerrando (opcional)
    logger.info("Cerrando la aplicación...")

app = FastAPI(lifespan=lifespan)

# --- Configuración de CORS ---
origins = [
    "http://localhost:3000",
    "https://registros-tiempos-1.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Inclusión de Routers ---
app.include_router(auth_router)
app.include_router(fichajes_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "API FastAPI funcionando correctamente"}
