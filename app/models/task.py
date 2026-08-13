from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="tasks")

    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_user = relationship("User", back_populates="assigned_tasks")

    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    lead = relationship("Lead", back_populates="tasks")
