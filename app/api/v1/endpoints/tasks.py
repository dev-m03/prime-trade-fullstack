from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import NotFoundError, ForbiddenError
from app.models.user import User, UserRole
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.dependencies.auth import get_current_active_user
from app.crud import task as task_crud

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
) -> list[TaskResponse]:
    if current_user.role == UserRole.ADMIN:
        tasks = await task_crud.get_all(db, skip=skip, limit=limit)
    else:
        tasks = await task_crud.get_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)
    return tasks


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_in: TaskCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> TaskResponse:
    task = await task_crud.create(db, task_in, owner_id=current_user.id)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> TaskResponse:
    task = await task_crud.get_by_id(db, task_id)
    if not task:
        raise NotFoundError(detail=f"Task with id {task_id} not found")
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise ForbiddenError(detail="Not authorized to access this task")
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> TaskResponse:
    task = await task_crud.get_by_id(db, task_id)
    if not task:
        raise NotFoundError(detail=f"Task with id {task_id} not found")
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise ForbiddenError(detail="Not authorized to modify this task")
    
    task = await task_crud.update(db, task, task_in)
    return task


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> None:
    task = await task_crud.get_by_id(db, task_id)
    if not task:
        raise NotFoundError(detail=f"Task with id {task_id} not found")
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise ForbiddenError(detail="Not authorized to delete this task")
    
    await task_crud.delete(db, task)
