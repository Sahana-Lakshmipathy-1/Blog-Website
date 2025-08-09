from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.Base import Base

DATABASE_URL = "postgresql://postgres:2205@localhost:5432/blog_application"

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
