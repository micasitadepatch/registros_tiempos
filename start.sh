#!/bin/sh

# Este script asegura que la base de datos se pueble antes de iniciar el servidor.

# 1. Ejecuta el script de seeding para crear los usuarios iniciales si no existen.
python seed_fastapi.py

# 2. Inicia el servidor de FastAPI. Uvicorn se mantendrá corriendo para aceptar peticiones.
# El host 0.0.0.0 es esencial para que Render pueda redirigir el tráfico a tu aplicación.
uvicorn app.main:app --host 0.0.0.0 --port 10000
