from fastapi import FastAPI
from . import models, database
from .auth import router as auth_router
from .fichajes import router as fichajes_router
from .users import router as users_router
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(fichajes_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "API FastAPI funcionando"}
