from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from models.blog import BlogCreate, BlogResponse, BlogUpdate
from db.session import get_db
from crud.blogoperations import (
    create_blog,
    get_blog_by_title,
    get_blog_by_uuid,
    get_all_blogs,
    get_blogs_by_username,
    update_blog_by_id,
    delete_blog_by_id,
)

router = APIRouter()

# Helper to get limiter from app state
def get_limiter(request: Request):
    return request.app.state.limiter

@router.post("/", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog_endpoint(
    blog: BlogCreate, 
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("5/minute")  # Allow 5 blog creations per minute per IP
    def inner():
        created_blog = create_blog(db, blog)
        if not created_blog:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create blog"
            )
        return created_blog
    return inner()

@router.get("/{title}", response_model=BlogResponse)
def read_blog(
    title: str, 
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("20/minute")  # Limit reads by title
    def inner():
        blog = get_blog_by_title(db, title)
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog not found"
            )
        return blog
    return inner()

@router.get("/", response_model=List[BlogResponse])
def read_all_blogs(
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("30/minute")  # Limit listing all blogs
    def inner():
        return get_all_blogs(db)
    return inner()

@router.get("/user/{username}", response_model=List[BlogResponse])
def read_blogs_by_username(
    username: str, 
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("15/minute")  # Limit fetching blogs by user
    def inner():
        return get_blogs_by_username(db, username)
    return inner()

@router.put("/{blog_id}", response_model=BlogResponse)
def update_blog_endpoint(
    blog_id: UUID, 
    blog_update: BlogUpdate, 
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("10/minute")  # Limit blog updates
    def inner():
        updated_blog = update_blog_by_id(db, blog_id, blog_update)
        if not updated_blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog not found or update failed"
            )
        return updated_blog
    return inner()

@router.delete("/{blog_id}", response_model=BlogResponse)
def delete_blog_endpoint(
    blog_id: UUID, 
    db: Session = Depends(get_db),
    limiter=Depends(get_limiter)
):
    @limiter.limit("5/minute")  # Limit deletes
    def inner():
        deleted_blog = delete_blog_by_id(db, blog_id)
        if not deleted_blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog not found or delete failed"
            )
        return deleted_blog
    return inner()
