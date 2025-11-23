from fastapi import FastAPI, Query
from . import models, database
from .auth import router as auth_router, get_password_hash
from .fichajes import router as fichajes_router
from .users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal
from .models import User

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# --- CORS CONFIGURATION FIX ---
# Define the list of allowed origins
origins = [
    "http://localhost:3000",  # Your local frontend
    "https://registros-tiempos-1.onrender.com" # Your deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the specific list of origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------

app.include_router(auth_router)
app.include_router(fichajes_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "API FastAPI funcionando"}

@app.post("/seed")
def seed_db(secret: str = Query(...)):
    try:
        if secret != "micasitaseed2025":
            return {"error": "No autorizado"}
        db = SessionLocal()
        usuarios = [
            {"username": "eva", "name": "Eva Huercano", "password": "0909", "role": "admin", "schedule": "10:00-14:00"},
            {"username": "admin", "name": "Administrador", "password": "0909", "role": "admin", "schedule": "10:00-14:00"},
            {"username": "asera", "name": "Asera Jimenez", "password": "1234", "role": "user", "schedule": "16:00-20:00"}
        ]
        creados = []
        for u in usuarios:
            if not db.query(User).filter_by(username=u["username"]).first():
                user = User(
                    username=u["username"],
                    name=u["name"],
                    password_hash=get_password_hash(u["password"]),
                    role=u["role"],
                    schedule=u["schedule"]
                )
                db.add(user)
                creados.append(u["username"])
        db.commit()
        db.close()
        return {"ok": True, "creados": creados}
    except Exception as e:
        return {"error": str(e)}
