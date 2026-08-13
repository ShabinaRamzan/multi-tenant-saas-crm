from datetime import datetime
from typing import Optional

from pydantic import BaseModel,EmailStr, Field

class CustomerCreate(BaseModel):
    name:str=Field(..., min_length=2, max_length=255)
    email:Optional[EmailStr]=None
    phone:Optional[str]=Field(None, max_length=50)
    address:Optional[str]=Field(None, max_length=500)
    notes:Optional[str]=None

class CustomerUpdate(BaseModel):
    name:Optional[str]=Field(..., min_length=2, max_length=255)
    email:Optional[EmailStr]=None
    phone:Optional[str]=Field(None, max_length=50)
    address:Optional[str]=Field(None, max_length=500)
    notes:Optional[str]=None

class CustomerResponse(BaseModel):
    id:int
    name:str
    email:Optional[str]=None
    phone:Optional[str]=None
    address:Optional[str]=None
    notes:Optional[str]=None
    comapny_id:int
    created_at: datetime
    class Config:
        from_attributes=True


                                