from datetime import datetime
from typing import Optional

from pydantic import BaseModel,EmailStr,Field

class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=500)

class CompanyResponse(BaseModel):
    id: int
    name: str
    email: str
    address: Optional[str] = None
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True

            