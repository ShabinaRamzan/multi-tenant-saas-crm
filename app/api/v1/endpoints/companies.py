from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user, require_role
from app.db.session import get_db
from app.models.company import Company
from app.models.user import User, UserRole
from app.schemas.company import CompanyUpdate, CompanyResponse

router = APIRouter()


@router.get("/me", response_model=CompanyResponse)
def get_my_company(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Current user ki apni company ki profile dikhata hai. Koi bhi logged-in user dekh sakta hai."""
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.put("/me", response_model=CompanyResponse)
def update_my_company(
    company_in: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    """Company profile update karta hai. Sirf ADMIN role ye kar sakta hai."""
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    update_data = company_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)
    return company

                                        