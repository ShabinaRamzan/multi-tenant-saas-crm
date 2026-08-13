from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="users")

    assigned_tasks = relationship("Task", back_populates="assigned_user")
