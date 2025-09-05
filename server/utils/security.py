# utils/security.py
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError

# --- Constants
# 🔑 Use a strong, random key in production
SECRET_KEY = "your-super-secret-key-that-should-be-in-env-file"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 45
REFRESH_TOKEN_EXPIRE_DAYS = 7

# --- Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    """Hashes a plain-text password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verifies a plain-text password against a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)

### JWT Token Management

def create_jwt_token(data, expires_delta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_access_token(data):
    """Creates a short-lived access token."""
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_jwt_token(data, expires_delta)

def create_refresh_token(data):
    """Creates a long-lived refresh token."""
    expires_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return create_jwt_token(data, expires_delta)

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None