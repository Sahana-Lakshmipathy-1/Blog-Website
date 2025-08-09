from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    name: str
    username: str
    useremail: EmailStr


class UserCreate(UserBase):
    password: str  # In real apps, hash before saving


class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    useremail: Optional[EmailStr] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True


class UserResponse(UserBase):
    userid: int

    class Config:
        orm_mode = True
