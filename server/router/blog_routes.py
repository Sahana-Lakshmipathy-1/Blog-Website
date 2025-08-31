from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from limiter import limiter # Your global limiter instance

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

# Correct import for the updated security function
from utils.security import decode_jwt_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

async def get_current_username(token: str = Depends(oauth2_scheme)) -> str:
    # Use the new function name to decode the token
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return username


@router.post("/", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_blog_endpoint(
    request: Request,
    blog: BlogCreate,
    username: str = Depends(get_current_username), # Inject current username from token
    db: Session = Depends(get_db),
):
    # Override username to prevent spoofing
    blog.username = username

    created_blog = create_blog(db, blog)
    if not created_blog:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create blog"
        )
    return created_blog


@router.get("/{blog_id}", response_model=BlogResponse)
@limiter.limit("20/minute")
async def read_blog_by_id(
    request: Request,
    blog_id: UUID,
    db: Session = Depends(get_db),
):
    blog = get_blog_by_uuid(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@router.get("/", response_model=List[BlogResponse])
@limiter.limit("30/minute")
async def read_all_blogs(
    request: Request,
    db: Session = Depends(get_db),
):
    return get_all_blogs(db)


@router.get("/user/{username}", response_model=List[BlogResponse])
@limiter.limit("15/minute")
async def read_blogs_by_username(
    request: Request,
    username: str,
    db: Session = Depends(get_db),
):
    return get_blogs_by_username(db, username)


@router.put("/{blog_id}/edit", response_model=BlogResponse)
@limiter.limit("10/minute")
async def update_blog_endpoint(
    request: Request,
    blog_id: UUID,
    blog_update: BlogUpdate,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    # Fetch the existing blog to check ownership
    existing_blog = get_blog_by_uuid(db, blog_id)
    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    if existing_blog.username != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog"
        )

    updated_blog = update_blog_by_id(db, blog_id, blog_update)
    if not updated_blog:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Update failed"
        )
    return updated_blog


@router.delete("/{blog_id}", response_model=BlogResponse)
@limiter.limit("5/minute")
async def delete_blog_endpoint(
    request: Request,
    blog_id: UUID,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    existing_blog = get_blog_by_uuid(db, blog_id)
    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    if existing_blog.username != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog"
        )

    deleted_blog = delete_blog_by_id(db, blog_id)
    if not deleted_blog:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Delete failed"
        )
    return deleted_blog
