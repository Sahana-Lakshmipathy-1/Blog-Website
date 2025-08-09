from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID


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

    model_config = {
        "from_attributes": True
    }


class UserResponse(UserBase):
    userid: UUID  # Changed from int to UUID

    model_config = {
        "from_attributes": True
    }
