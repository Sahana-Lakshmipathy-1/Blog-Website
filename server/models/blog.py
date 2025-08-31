from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date, datetime
from uuid import UUID

# Base model shared between create and response
class BlogBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    content: str
    badge: Optional[str] = None
    img_url: Optional[str] = None  # Optional Cloudinary URL
    created_at: Optional[datetime] = None


# Model used when creating a new blog
class BlogCreate(BlogBase):
    username: str  # Foreign key reference to users.username

# Model used for updating a blog
class BlogUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    badge: Optional[str] = None
    img_url: Optional[HttpUrl] = None
    delete_flag: Optional[bool] = None  # Soft delete

    model_config = {
        "from_attributes": True
    }

# Model used for returning blog data in responses
class BlogResponse(BlogBase):
    id: UUID
    username: str
    created_at: datetime
    delete_flag: bool

    model_config = {
        "from_attributes": True
    }
