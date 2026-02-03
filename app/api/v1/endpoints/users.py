from typing import Annotated

from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_active_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> UserResponse:
    return current_user
