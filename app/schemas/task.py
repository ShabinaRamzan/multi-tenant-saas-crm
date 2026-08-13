from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.task import TaskStatus, TaskPriority


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None
    lead_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None
    lead_id: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime] = None
    company_id: int
    assigned_to: Optional[int] = None
    lead_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
