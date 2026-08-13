from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    LOST = "lost"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    source = Column(String(100), nullable=True)
    estimated_value = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="leads")

    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer = relationship("Customer", back_populates="leads")

    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    tasks = relationship("Task", back_populates="lead", cascade="all, delete-orphan")
