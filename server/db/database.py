import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.Base import Base
from dotenv import load_dotenv

# Load environment variables from .env file (make sure .env exists at root)
load_dotenv()

# Get database URL from environment, fallback to your current hardcoded string
DATABASE_URL = os.getenv("database_url")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# Create SQLAlchemy engine with encoding and echo disabled for production readiness
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to enable SQL logging for debugging
    connect_args={"options": "-c timezone=utc"}  
)

# Create all tables based on Base metadata
Base.metadata.create_all(bind=engine)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
