from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from models.user import UserCreate, UserResponse, UserUpdate
from crud.useroperations import (
    create_user,
    get_user_by_username,
    get_user_by_email,
    update_user_by_username,
    delete_user_by_username,
)
from db.session import get_db

# SlowAPI imports
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# -------------------------
# Create User
# -------------------------
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")  # prevent abuse of user creation
def create_user_endpoint(
    request: Request,
    user: UserCreate,
    db: Session = Depends(get_db)
):
    if get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    if get_user_by_email(db, user.useremail):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    created_user = create_user(db, user)
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User creation failed",
        )
    return created_user

# -------------------------
# Read User
# -------------------------
@router.get("/{username}", response_model=UserResponse)
@limiter.limit("30/minute")  # read-heavy, so higher limit
def read_user(
    request: Request,
    username: str,
    db: Session = Depends(get_db)
):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

# -------------------------
# Update User
# -------------------------
@router.put("/{username}", response_model=UserResponse)
@limiter.limit("10/minute")  # prevent excessive updates
def update_user_endpoint(
    request: Request,
    username: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db)
):
    updated_user = update_user_by_username(db, username, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or update failed",
        )
    return updated_user

# -------------------------
# Delete User
# -------------------------
@router.delete("/{username}", response_model=UserResponse)
@limiter.limit("5/minute")  # restrict delete attempts
def delete_user_endpoint(
    request: Request,
    username: str,
    db: Session = Depends(get_db)
):
    deleted_user = delete_user_by_username(db, username)
    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or delete failed",
        )
    return deleted_user
