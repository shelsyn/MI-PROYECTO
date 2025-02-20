from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, auth
from .database import get_db
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer()

#  Endpoint para crear una publicación (requiere autenticación)
@router.post("/publicaciones", response_model=schemas.PublicacionResponse)
def crear_publicacion(
    publicacion: schemas.PublicacionCreate, 
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    usuario = auth.get_current_user(credentials)

    nueva_publicacion = models.Publicacion(
        titulo=publicacion.titulo,
        contenido=publicacion.contenido,
        usuario_id=usuario["id"]  # ✅ Se asigna automáticamente el usuario autenticado
    )
    
    db.add(nueva_publicacion)
    db.commit()
    db.refresh(nueva_publicacion)
    return nueva_publicacion


# Endpoint para listar publicaciones del usuario autenticado
@router.get("/publicaciones", response_model=List[schemas.PublicacionResponse])
def listar_publicaciones(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    usuario = auth.get_current_user(credentials)
    publicaciones = db.query(models.Publicacion).filter(models.Publicacion.usuario_id == usuario["id"]).all()
    return publicaciones


#  Endpoint para editar una publicación del usuario autenticado
@router.put("/publicaciones/{post_id}", response_model=schemas.PublicacionResponse)
def editar_publicacion(
    post_id: int, 
    publicacion: schemas.PublicacionCreate, 
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    usuario = auth.get_current_user(credentials)
    
    publicacion_db = db.query(models.Publicacion).filter(
        models.Publicacion.id == post_id, 
        models.Publicacion.usuario_id == usuario["id"]
    ).first()

    if not publicacion_db:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no tienes permiso para editarla")
    
    publicacion_db.titulo = publicacion.titulo
    publicacion_db.contenido = publicacion.contenido
    db.commit()
    db.refresh(publicacion_db)
    return publicacion_db


# Endpoint para eliminar una publicación del usuario autenticado
@router.delete("/publicaciones/{post_id}", status_code=204)
def eliminar_publicacion(
    post_id: int, 
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    usuario = auth.get_current_user(credentials)
    
    publicacion = db.query(models.Publicacion).filter(
        models.Publicacion.id == post_id, 
        models.Publicacion.usuario_id == usuario["id"]
    ).first()

    if not publicacion:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no tienes permiso para eliminarla")
    
    db.delete(publicacion)
    db.commit()
