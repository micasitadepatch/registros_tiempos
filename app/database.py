import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv # Importar load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# --- DATABASE URL CONFIGURATION ---
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./fichajes.db")

# FIX for Render's PostgreSQL URL format (esto ya no es necesario si solo usas MySQL en Dynahosting, pero lo mantengo por si acaso)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
# ---------------------------------

# --- ENGINE CONFIGURATION ---
# Default arguments
engine_args = {}

# If SQLite, add specific connect_args for single-threaded operation
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_args['connect_args'] = {"check_same_thread": False}

# If PostgreSQL, add specific connect_args to require SSL (for Render)
elif SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    engine_args['connect_args'] = {"sslmode": "require"}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, **engine_args
)
# ---------------------------

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
