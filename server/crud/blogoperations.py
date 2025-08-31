from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.blogBase import Blogs  # Your SQLAlchemy model
from models.blog import BlogCreate, BlogUpdate
from uuid import uuid4, UUID
from datetime import datetime

def create_blog(db: Session, blog: BlogCreate):
    db_blog = Blogs(
        id=uuid4(),
        title=blog.title,
        subtitle=blog.subtitle,
        content=blog.content,
        username=blog.username,
        badge=blog.badge or "New Article",
        img_url=blog.img_url,
        delete_flag=False,
        created_at=datetime.now()
    )
    try:
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error creating blog: {e}")
        return None

def get_blog_by_title(db: Session, title: str):
    return db.query(Blogs).filter(
        Blogs.title == title,
        Blogs.delete_flag == False
    ).first()

def get_blogs_by_username(db: Session, username: str):
    return db.query(Blogs).filter(
        Blogs.username == username,
        Blogs.delete_flag == False
    ).order_by(Blogs.created_at.desc()).all()

def get_blog_by_uuid(db: Session, blog_id: UUID):
    return db.query(Blogs).filter(
        Blogs.id == blog_id,
        Blogs.delete_flag == False
    ).first()

def get_all_blogs(db: Session):
    return db.query(Blogs).filter(
        Blogs.delete_flag == False
    ).order_by(Blogs.created_at.desc()).all()

def update_blog_by_id(db: Session, blog_id: UUID, blog: BlogUpdate):
    try:
        db_blog = db.query(Blogs).filter(
            Blogs.id == blog_id,
            Blogs.delete_flag == False
        ).first()
        if not db_blog:
            return None
        # Only update fields that are set
        for key, value in blog.dict(exclude_unset=True).items():
            setattr(db_blog, key, value)
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error updating blog: {e}")
        return None

def delete_blog_by_id(db: Session, blog_id: UUID):
    try:
        db_blog = db.query(Blogs).filter(Blogs.id == blog_id).first()
        if db_blog:
            db_blog.delete_flag = True  # Soft delete
            db.commit()
            db.refresh(db_blog)
            return db_blog
        return None
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error deleting blog: {e}")
        return None
