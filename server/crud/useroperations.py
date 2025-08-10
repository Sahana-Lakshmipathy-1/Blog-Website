# crud/useroperations.py

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.userBase import User
from models.user import UserCreate, UserUpdate
from utils.security import hash_password  # ✅ single source for hashing

# -----------------------
# Create a new user
# -----------------------
def create_user(db: Session, user: UserCreate):
    try:
        hashed_pwd = hash_password(user.password)
        db_user = User(
            name=user.name,
            username=user.username,
            useremail=user.useremail,
            password=hashed_pwd
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        print(f"[DB ERROR] create_user: {e}")
        return None

# -----------------------
# Get user by username
# -----------------------
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# -----------------------
# Get user by email
# -----------------------
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.useremail == email).first()

# -----------------------
# Update user by username
# -----------------------
def update_user_by_username(db: Session, username: str, user: UserUpdate):
    try:
        db_user = db.query(User).filter(User.username == username).first()
        if not db_user:
            return None

        # Only update fields provided
        for key, value in user.dict(exclude_unset=True).items():
            setattr(db_user, key, value)

        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        print(f"[DB ERROR] update_user_by_username: {e}")
        return None

# -----------------------
# Delete user by username
# -----------------------
def delete_user_by_username(db: Session, username: str):
    try:
        db_user = db.query(User).filter(User.username == username).first()
        if not db_user:
            return None

        db.delete(db_user)
        db.commit()
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        print(f"[DB ERROR] delete_user_by_username: {e}")
        return None
