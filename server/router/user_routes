from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.user import UserCreate, UserResponse, UserUpdate
from crud.useroperations import (
    create_user,
    get_user_by_username,
    get_user_by_email,
    get_all_users,
    update_user_by_username,
    delete_user_by_username,
)
from db.session import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
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

@router.get("/{username}", response_model=UserResponse)
def read_user(username: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@router.get("/", response_model=List[UserResponse])
def read_all_users(db: Session = Depends(get_db)):
    return get_all_users(db)

@router.put("/{username}", response_model=UserResponse)
def update_user_endpoint(username: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    updated_user = update_user_by_username(db, username, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or update failed",
        )
    return updated_user

@router.delete("/{username}", response_model=UserResponse)
def delete_user_endpoint(username: str, db: Session = Depends(get_db)):
    deleted_user = delete_user_by_username(db, username)
    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or delete failed",
        )
    return deleted_user
