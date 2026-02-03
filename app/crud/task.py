from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def get_by_id(db: AsyncSession, task_id: int) -> Task | None:
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Task]:
    result = await db.execute(select(Task).offset(skip).limit(limit))
    return list(result.scalars().all())


async def get_by_owner(db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> list[Task]:
    result = await db.execute(
        select(Task).where(Task.owner_id == owner_id).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


async def create(db: AsyncSession, task_in: TaskCreate, owner_id: int) -> Task:
    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        owner_id=owner_id,
    )
    db.add(db_task)
    await db.flush()
    await db.refresh(db_task)
    return db_task


async def update(db: AsyncSession, db_task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    await db.flush()
    await db.refresh(db_task)
    return db_task


async def delete(db: AsyncSession, db_task: Task) -> None:
    await db.delete(db_task)
    await db.flush()
