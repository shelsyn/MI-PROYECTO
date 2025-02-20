from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from auth import get_current_user  # ✅ Importamos la función de validación de token
import models, schemas

# Inicializar Base
Base.metadata.create_all(bind=engine)

# Crear app FastAPI
app = FastAPI()

# Endpoint protegido para crear publicaciones
@app.post("/publicaciones", response_model=schemas.PublicacionResponse)
def crear_publicacion(publicacion: schemas.PublicacionCreate, 
                      db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):  
    try:
        nueva_publicacion = models.Publicacion(
            titulo=publicacion.titulo,
            contenido=publicacion.contenido,
            usuario_id=current_user["id"]  
        )
        db.add(nueva_publicacion)
        db.commit()
        db.refresh(nueva_publicacion)
        return nueva_publicacion
    except Exception as e:
        print(f"Error al crear publicación: {e}")
        raise HTTPException(status_code=500, detail=f"Error al crear publicación: {e}")

# Endpoint para listar publicaciones
@app.get("/publicaciones")
def listar_publicaciones(db: Session = Depends(get_db)):
    publicaciones = db.query(models.Publicacion).all()
    return publicaciones

@app.get("/")
def home():
    return {"message": "Microservicio de Publicaciones Activo"}
