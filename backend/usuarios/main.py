from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.openapi.models import OAuth2 as OAuth2Model
from fastapi.openapi.utils import get_openapi
from routes import router
from fastapi.middleware.cors import CORSMiddleware
from usuarios.routes import router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Microservicio de Usuarios",
        version="1.0.0",
        description="API para autenticación de usuarios con JWT",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Microservicio de Usuarios Activo"}
