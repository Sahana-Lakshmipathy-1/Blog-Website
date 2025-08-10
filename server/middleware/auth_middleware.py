# middleware/auth_middleware.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from utils.security import decode_access_token


class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, public_paths=None):
        super().__init__(app)
        # Set of paths that do not require authentication
        self.public_paths = set(public_paths or [])

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Skip authentication for public paths (exact match or prefix)
        if any(path == p or path.startswith(p) for p in self.public_paths):
            return await call_next(request)

        # Get Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing Authorization header"}
            )

        # Extract token
        token = auth_header.split(" ", 1)[1]

        # Decode and verify token
        payload = decode_access_token(token)
        if not payload:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"}
            )

        # Optional: attach payload to request.state for downstream use
        request.state.user = payload

        return await call_next(request)
