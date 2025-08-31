from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

# -------------------------
# Shared fields
# -------------------------
class BlogBase(BaseModel):
    title: str
    content: str
    subtitle: Optional[str] = None
    badge: Optional[str] = "New Article"
    img_url: Optional[str] = None  # always a string or None


# -------------------------
# Create schema
# -------------------------
class BlogCreate(BlogBase):
    username: str  # required on create


# -------------------------
# Update schema
# -------------------------
class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    img_url: Optional[str] = None


# -------------------------
# Response schema
# -------------------------
class BlogResponse(BlogBase):
    id: UUID                  # ✅ match DB UUID primary key
    username: str
    created_at: Optional[datetime] = None  # optional, include if DB tracks timestamps
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
