from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from db.session import get_db
from crud.useroperations import create_user, get_user_by_username
from utils.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_jwt_token
)
from models.auth import SignupRequest
from limiter import limiter 

router = APIRouter()

# Pydantic model for login request
class LoginRequest(BaseModel):
    username: str
    password: str

# Pydantic model for the token refresh request
class RefreshRequest(BaseModel):
    refresh_token: str

# Pydantic model for the complete token response
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

# Signup endpoint with rate limiting
@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def signup(
    request: Request,
    user: SignupRequest,
    db: Session = Depends(get_db),
):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    created_user = create_user(db, user)
    if not created_user:
        raise HTTPException(status_code=500, detail="Error creating user")
    return {"message": "User created successfully"}

# Login endpoint that issues both access and refresh tokens
@router.post("/token", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login_for_access_token(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_username(db, login_data.username)
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create both the short-lived access token and the long-lived refresh token
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})

    # Return the full token response
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

# New endpoint to handle token refreshing
@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("10/minute")
async def refresh_access_token(
    request: Request,
    refresh_data: RefreshRequest,
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode the refresh token to get the user's information
    payload = decode_jwt_token(refresh_data.refresh_token)
    if not payload:
        raise credentials_exception
    
    username = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    # Check if the user still exists in the database
    user = get_user_by_username(db, username)
    if not user:
        raise credentials_exception
    
    # Create a new access token
    new_access_token = create_access_token(data={"sub": username})
    
    # Return the new access token. We don't issue a new refresh token here.
    return {
        "access_token": new_access_token, 
        "token_type": "bearer",
        "refresh_token": None
    }
