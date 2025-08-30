from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from db import database
import uvicorn

from middleware.cors import setup_cors
from middleware.auth_middleware import JWTAuthMiddleware
from router.user_routes import router as user_router
from router.blog_routes import router as blog_router
from router.auth_routes import router as auth_router
from router.blog_response import router as response_router

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

PUBLIC_PATHS = [
    "/api/auth/signup",
    "/api/auth/token",
    "/docs",
    "/openapi.json"
]

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="My API",
    version="1.0.0",
    description="API with JWT authentication, public routes, and rate limiting."
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup CORS middleware FIRST, before JWT middleware
setup_cors(app)

# Then add JWT middleware
app.add_middleware(JWTAuthMiddleware, public_paths=PUBLIC_PATHS)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(blog_router, prefix="/api/blogs", tags=["blogs"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(response_router, prefix="/generate", tags=["generate"])

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

    for path, methods in openapi_schema.get("paths", {}).items():
        if not any(path.startswith(pub) for pub in PUBLIC_PATHS):
            for method in methods.values():
                method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=2500, reload=True)
