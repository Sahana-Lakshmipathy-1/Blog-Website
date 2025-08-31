from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.blogBase import Blogs  # Your SQLAlchemy model
from models.blog import BlogCreate, BlogUpdate
from uuid import uuid4, UUID
from datetime import datetime
from fastapi import UploadFile
import cloudinary.uploader
from fastapi import HTTPException


def create_blog(db: Session, blog: BlogCreate, file: UploadFile = None):
    img_url = blog.img_url  # default if passed in payload

    # Try Cloudinary upload if a file is provided
    if file:
        try:
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="blogs"
            )
            img_url = upload_result.get("secure_url")
        except Exception as e:
            print("Cloudinary upload failed:", e)
            img_url = None

    try:
        # Proper blog object with all required fields
        db_blog = Blogs(
            id=uuid4(),
            title=blog.title,
            subtitle=blog.subtitle,
            content=blog.content,
            username=blog.username,
            badge=blog.badge or "New Article",
            img_url=img_url,
            delete_flag=False,
            created_at=datetime.now()
        )
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
        return db_blog

    except Exception as e:
        import traceback
        print("🔥 ERROR while creating blog:", str(e))
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

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
