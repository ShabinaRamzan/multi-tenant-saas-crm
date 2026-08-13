from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.lead import Lead
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse

router = APIRouter()


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_lead = Lead(
        **lead_in.model_dump(),
        company_id=current_user.company_id,
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead


@router.get("/", response_model=List[LeadResponse])
def list_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leads = (
        db.query(Lead)
        .filter(Lead.company_id == current_user.company_id)
        .all()
    )
    return leads


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id, Lead.company_id == current_user.company_id)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int,
    lead_in: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id, Lead.company_id == current_user.company_id)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = lead_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)

    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id, Lead.company_id == current_user.company_id)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db.delete(lead)
    db.commit()
    return None




    