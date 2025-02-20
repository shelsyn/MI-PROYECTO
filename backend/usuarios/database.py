import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from usuarios.models import Base 

load_dotenv()

#  URL de conexión a PostgreSQL
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    print(" Creando tablas en la base de datos de usuarios")
    Base.metadata.create_all(bind=engine)
    print("Tablas de Usuarios creadas correctamente.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
