from fastapi import FastAPI
from db import database
import uvicorn

from router.user_routes import router as user_router
from router.blog_routes import router as blog_router
from router.auth_routes import router as auth_router

app = FastAPI()

# Dependency (you can keep it in db.session or here)
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register routers with "/api" prefix
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(blog_router, prefix="/api/blogs", tags=["blogs"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])



if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=2500, reload=True)
