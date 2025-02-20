import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Importar bases de datos  (usuarios y publicaciones)
from usuarios.database import engine as engine_usuarios
from usuarios.models import Base as BaseUsuarios
from publicaciones.database import engine as engine_publicaciones
from publicaciones.models import Base as BasePublicaciones

def init_db():
    print(" Creando tablas en la base de datos")

    # bd usuarios
    BaseUsuarios.metadata.create_all(bind=engine_usuarios)
    print("Tablas de Usuarios creadas.")

    # bd publicaciones
    BasePublicaciones.metadata.create_all(bind=engine_publicaciones)
    print("Tablas de Publicaciones creadas.")

if __name__ == "__main__":
    init_db()
