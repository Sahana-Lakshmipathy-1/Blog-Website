from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from utils.security import decode_access_token


class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, public_paths=None):
        super().__init__(app)
        self.public_paths = set(public_paths or [])

    async def dispatch(self, request: Request, call_next):
        # Allow all OPTIONS requests to pass through (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path

        # Bypass auth for public paths (exact or prefix match)
        if any(path == p or path.startswith(p) for p in self.public_paths):
            return await call_next(request)

        # Check Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing Authorization header"}
            )

        token = auth_header.split(" ", 1)[1]

        # Validate JWT token
        payload = decode_access_token(token)
        if not payload:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"}
            )

        # Attach user info to request state
        request.state.user = payload

        return await call_next(request)
