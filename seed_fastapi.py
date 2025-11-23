from app.database import SessionLocal, engine
from app.models import User, Base
from app.auth import get_password_hash

def seed_users():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    users = [
        {"username": "eva", "name": "Eva Huercano", "password": "0909", "role": "admin", "schedule": "10:00-14:00", "auto_fichaje": 1},
        {"username": "admin", "name": "Administrador", "password": "0909", "role": "admin", "schedule": "10:00-14:00", "auto_fichaje": 1},
        {"username": "asera", "name": "Asera Jimenez", "password": "1234", "role": "user", "schedule": "16:00-20:00", "auto_fichaje": 0},
    ]
    for u in users:
        exists = db.query(User).filter(User.username == u["username"]).first()
        if not exists:
            user = User(
                username=u["username"],
                name=u["name"],
                password_hash=get_password_hash(u["password"]),
                role=u["role"],
                schedule=u["schedule"],
                auto_fichaje=u["auto_fichaje"]
            )
            db.add(user)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
    print("Usuarios de ejemplo insertados correctamente.")
