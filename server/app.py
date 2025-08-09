from fastapi import FastAPI
from db import database

from router.user_routes import router as user_router
from router.blog_routes import router as blog_router
from router.auth_routes import router as auth_router  # Include your auth router here

app = FastAPI()

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers with their own prefixes and tags
app.include_router(user_router)
app.include_router(blog_router)
app.include_router(auth_router)  # enable this once your auth routes are ready
