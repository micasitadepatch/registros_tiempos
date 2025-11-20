# Backend FastAPI (estructura limpia)

- Código en `app/` (modular, escalable, buenas prácticas)
- Base de datos: SQLite (`fichajes.db` en la raíz)
- Autenticación: JWT
- Arranque: `start_backend.bat` o `uvicorn app.main:app --reload`

## Estructura
- `app/database.py`: conexión y base SQLAlchemy
- `app/models.py`: modelos ORM
- `app/schemas.py`: esquemas Pydantic
- `app/auth.py`: rutas de autenticación y JWT
- `app/main.py`: punto de entrada FastAPI

## Primeros pasos
1. Instala dependencias: `pip install -r requirements.txt`
2. Arranca el backend: `start_backend.bat`
3. Accede a la API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

