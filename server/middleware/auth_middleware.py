from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import Set, Optional

# Correct import for the updated security file
from utils.security import decode_jwt_token


class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, public_paths: Optional[Set[str]] = None):
        super().__init__(app)
        # Using a set provides efficient O(1) lookups
        self.public_paths = public_paths or set()
        
    async def dispatch(self, request: Request, call_next):
        # Allow all OPTIONS requests to pass through (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path

        # Bypass authentication for paths explicitly marked as public
        if any(path.startswith(p) for p in self.public_paths):
            return await call_next(request)

        # Get the token from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid Authorization header",
            )

        token = auth_header.split(" ", 1)[1]

        # Validate the JWT token using the correct function
        payload = decode_jwt_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        # Attach the user payload to the request state
        request.state.user = payload

        # Continue with the request
        return await call_next(request)
