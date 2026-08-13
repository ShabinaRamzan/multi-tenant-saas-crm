from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr


class UserRegister(UserBase):
    password: str = Field(..., min_length=6)
    company_name: str = Field(..., min_length=2, max_length=255)
    company_email: EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    company_id: int
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True
