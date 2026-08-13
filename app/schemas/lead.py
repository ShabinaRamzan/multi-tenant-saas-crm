from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel,Field 
from app.models.lead import LeadStatus

class LeadCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    source: Optional[str] = Field(None, max_length=100)
    estimated_value: Optional[Decimal] = None
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None


class LeadUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    status: Optional[LeadStatus] = None
    source: Optional[str] = Field(None, max_length=100)
    estimated_value: Optional[Decimal] = None
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None


class LeadResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: LeadStatus
    source: Optional[str] = None
    estimated_value: Optional[Decimal] = None
    company_id: int
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

            