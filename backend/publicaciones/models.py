from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

# Definir Usuario primero
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    contraseña = Column(String, nullable=False)

    # Relación con Publicaciones
    publicaciones = relationship("Publicacion", back_populates="usuario")

# Definir Publicacion después
class Publicacion(Base):
    __tablename__ = "publicaciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    contenido = Column(Text, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    # Relación con Usuario
    usuario = relationship("Usuario", back_populates="publicaciones")
