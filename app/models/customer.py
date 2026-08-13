from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="customers")

    leads = relationship("Lead", back_populates="customer", cascade="all, delete-orphan")
