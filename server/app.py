from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from db import database
import uvicorn
from middleware.cors import setup_cors
from middleware.auth_middleware import JWTAuthMiddleware
from router.user_routes import router as user_router
from router.blog_routes import router as blog_router
from router.auth_routes import router as auth_router

# Public endpoints that bypass JWT auth
PUBLIC_PATHS = [
    "/api/auth/signup",
    "/api/auth/token",
    "/docs",
    "/openapi.json"
]

# Create FastAPI app
app = FastAPI(
    title="My API",
    version="1.0.0",
    description="API with JWT authentication and public routes."
)

# Setup CORS
setup_cors(app)

# Add JWT middleware with public paths
app.add_middleware(JWTAuthMiddleware, public_paths=PUBLIC_PATHS)

# DB dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register routers
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(blog_router, prefix="/api/blogs", tags=["blogs"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


# Add Swagger Bearer Auth so "Authorize" button appears
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    
    e
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=2500, reload=True)
