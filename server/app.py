from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from db import database
from crud import blogoperations, useroperations
from models import blog, user

app = FastAPI()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# USER ROUTES
@app.post("/users/")
def create_user(user_data: user.UserCreate, db: Session = Depends(get_db)):
    return useroperations.create_user(db, user_data)

@app.get("/users/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    db_user = useroperations.get_user_by_username(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# BLOG ROUTES
@app.post("/blogs/")
def create_blog(blog_data: blog.BlogCreate, db: Session = Depends(get_db)):
    return blogoperations.create_blog(db, blog_data)

@app.get("/blogs/{blog_id}")
def get_blog(blog_id: UUID, db: Session = Depends(get_db)):
    db_blog = blogoperations.get_blog_by_uuid(db, blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog
