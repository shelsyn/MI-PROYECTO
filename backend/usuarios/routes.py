from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Usuario
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# autenticación con JWT
SECRET_KEY = os.getenv("SECRET_KEY", "supersecreto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Fn para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# crear usuarios
class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    contraseña: str

# Esquema para actualización del perfil
class UsuarioUpdate(BaseModel):
    nombre: str
    email: str

# Token
class TokenData(BaseModel):
    email: str

# Fn para generar token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Fn para obtener usuario autenticado a partir del Token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = db.query(Usuario).filter(Usuario.email == token_data.email).first()
    if user is None:
        raise credentials_exception

    return user

# Endpoint para registrar un usuario
@router.post("/register", status_code=201)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")

    hashed_password = pwd_context.hash(usuario.contraseña)

    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        contraseña=hashed_password
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"message": "Usuario registrado exitosamente"}

# Endpoint para iniciar sesión y obtener JWT
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.contraseña):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para obtener datos del usuario autenticado
@router.get("/profile")
def get_profile(current_user: Usuario = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "email": current_user.email
    }

# ✅ Nuevo Endpoint para actualizar el perfil del usuario
@router.put("/profile")
def update_profile(
    updated_user: UsuarioUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Actualizar los campos
    current_user.nombre = updated_user.nombre
    current_user.email = updated_user.email

    # Guardar cambios
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Perfil actualizado exitosamente",
        "user": {
            "id": current_user.id,
            "nombre": current_user.nombre,
            "email": current_user.email
        }
    }
