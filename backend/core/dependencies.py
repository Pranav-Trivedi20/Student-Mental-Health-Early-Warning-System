
import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)
from sqlalchemy.orm import Session

from core.security import verify_access_token
from db.database import get_database_session
from models.user import User


# Extract Bearer token from the request
bearer_scheme = HTTPBearer(auto_error=False)


# Identify the currently logged-in student
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    database_session: Session = Depends(get_database_session)
) -> User:

    # Check whether the request contains a token
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        # Verify and decode the JWT
        token_payload = verify_access_token(
            credentials.credentials
        )

        # Extract student ID from the token
        student_id = int(token_payload.get("sub"))

    except (jwt.InvalidTokenError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Find the student in PostgreSQL
    current_student = (
        database_session.query(User)
        .filter(User.id == student_id)
        .first()
    )

    if current_student is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Student account not found.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return current_student
