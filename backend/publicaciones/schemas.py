from pydantic import BaseModel

class PublicacionBase(BaseModel):
    titulo: str
    contenido: str

class PublicacionCreate(PublicacionBase):
    pass  # No necesitamos usuario_id aquí

class PublicacionResponse(PublicacionBase):
    id: int
    usuario_id: int

    class Config:
        from_attributes = True  # Si estás usando Pydantic v2
