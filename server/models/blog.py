from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class BlogBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    content: str

class BlogCreate(BlogBase):
    username: str  # Foreign key reference to users.username
    badge: Optional[str] = None

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    badge: Optional[str] = None
    delete_flag: Optional[bool] = None  # Soft delete indicator

    class Config:
        orm_mode = True

class BlogResponse(BlogBase):
    id: UUID  # Changed from int to UUID
    created_at: datetime
    badge: str
    delete_flag: bool
    username: str

    class Config:
        orm_mode = True
