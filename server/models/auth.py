# models/auth.py
from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    name: str
    username: str
    useremail: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str  # or email if you allow login by email
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
