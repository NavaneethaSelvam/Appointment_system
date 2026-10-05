from datetime import datetime, timedelta

from jose import jwt, JWTError
from passlib.context import CryptContext

from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)


# ==================================================
# JWT CONFIGURATION
# ==================================================

SECRET_KEY = "appoint-ease-secret-key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ==================================================
# PASSWORD CONFIGURATION
# ==================================================

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


# ==================================================
# BEARER AUTHENTICATION
# ==================================================

security = HTTPBearer()


# ==================================================
# HASH PASSWORD
# ==================================================

def hash_password(password: str):

    return pwd_context.hash(password)


# ==================================================
# VERIFY PASSWORD
# ==================================================

def verify_password(
    password: str,
    hashed_password: str
):

    return pwd_context.verify(
        password,
        hashed_password
    )


# ==================================================
# CREATE ACCESS TOKEN
# ==================================================

def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload["exp"] = expire

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# ==================================================
# GET CURRENT ADMIN
# ==================================================

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    try:

        # Decode JWT token
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Get values from token
        user_id = payload.get("user_id")
        role = payload.get("role")

        # Check required data
        if user_id is None or role is None:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

        # Check admin role
        if role != "admin":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Return authenticated admin
        return {
            "user_id": user_id,
            "role": role
        }

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )