from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.userBase import User
from models.user import UserCreate, UserUpdate
from utils.hash import hash_password

def create_user(db: Session, user: UserCreate):
    hashed_pwd = hash_password(user.password)
    db_user = User(
        name=user.name,
        username=user.username,
        useremail=user.useremail,
        password=hashed_pwd
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error creating user: {e}")
        return None

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.useremail == email).first()


def update_user_by_username(db: Session, username: str, user: UserUpdate):
    try:
        db_user = db.query(User).filter(User.username == username).first()
        if not db_user:
            return None
        for key, value in user.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error updating user: {e}")
        return None

def delete_user_by_username(db: Session, username: str):
    try:
        db_user = db.query(User).filter(User.username == username).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return db_user
        return None
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error deleting user: {e}")
        return None
