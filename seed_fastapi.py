from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def seed_users():
    db = SessionLocal()
    users = [
        {"username": "eva", "name": "Eva Huercano", "password": "0909", "role": "admin"},
        {"username": "admin", "name": "Administrador", "password": "0909", "role": "admin"},
        {"username": "asera", "name": "Asera Jimenez", "password": "1234", "role": "user"},
    ]
    for u in users:
        exists = db.query(User).filter(User.username == u["username"]).first()
        if not exists:
            user = User(
                username=u["username"],
                name=u["name"],
                password_hash=get_password_hash(u["password"]),
                role=u["role"]
            )
            db.add(user)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
    print("Usuarios de ejemplo insertados correctamente.")

