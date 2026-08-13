from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    address = Column(String(500), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="company", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="company", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="company", cascade="all, delete-orphan")
