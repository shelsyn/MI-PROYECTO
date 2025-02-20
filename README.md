Esta aplicación es una plataforma fullstack que permite a los usuarios registrarse, autenticarse y gestionar publicaciones. El proyecto está compuesto por:

Frontend: Aplicación React.js (ejecutada fuera de Docker).

Backend:
Microservicio de Usuarios (FastAPI) para autenticación y gestión de perfiles.
Microservicio de Publicaciones (FastAPI) para creación y gestión de publicaciones.
Base de Datos: PostgreSQL.

Tecnologías Utilizadas

-Frontend: React.js
-Backend: FastAPI (Python)
-Base de Datos: PostgreSQL
-Autenticación: JWT (JSON Web Tokens)
-Contenerización: Docker + Docker Compose

Docker Compose para levantar los microservicios y la base de datos PostgreSQL:
docker-compose up --build
Usuarios: http://localhost:8001
Publicaciones: http://localhost:8002
Base de Datos: localhost:5432

 ------Endpoints Principales

📌 Microservicio de Usuarios (/users_service)

POST /register → Registrar un nuevo usuario.
POST /login → Autenticación y generación de JWT.
GET /profile → Obtener el perfil del usuario autenticado.

📌 Microservicio de Publicaciones (/posts_service)

POST /posts → Crear nueva publicación.
GET /posts → Listar publicaciones del usuario autenticado.
DELETE /posts/{id} → Eliminar publicación por ID.