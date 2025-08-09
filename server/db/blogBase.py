from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, text
from sqlalchemy.sql import func
from db.Base import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Blogs(Base):
    __tablename__ = "blogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    badge = Column(String(50), nullable=True, default="New Article", server_default=text("'New Article'"))
    
    # <-- Add this line here
    username = Column(String(50), ForeignKey("users.username"), nullable=False)
    
    delete_flag = Column(Boolean, default=False)
