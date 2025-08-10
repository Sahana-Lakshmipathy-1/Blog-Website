from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db.session import get_db
from crud.useroperations import create_user, get_user_by_username
from utils.security import verify_password, create_access_token
from models.auth import SignupRequest
from models.token import Token
from limiter import limiter  # Your global limiter instance

router = APIRouter()

# Pydantic model for login
class LoginRequest(BaseModel):
    username: str
    password: str

# Signup endpoint with proper rate limiting
@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")  # Apply limiter decorator directly
async def signup(
    request: Request,              # Must include 'request' for limiter to work
    user: SignupRequest,
    db: Session = Depends(get_db),
):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    created_user = create_user(db, user)
    if not created_user:
        raise HTTPException(status_code=500, detail="Error creating user")
    return {"message": "User created successfully"}

# Login endpoint with proper rate limiting
@router.post("/token", response_model=Token)
@limiter.limit("10/minute")
async def login_for_access_token(
    request: Request,              # Include 'request' here as well
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
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
