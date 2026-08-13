from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerResponse , CustomerUpdate


router = APIRouter()


@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_customer = Customer(
        **customer_in.model_dump(),
        company_id=current_user.company_id,
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer


@router.get("/", response_model=List[CustomerResponse])
def list_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customers = (
        db.query(Customer)
        .filter(Customer.company_id == current_user.company_id)
        .all()
    )
    return customers


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.company_id == current_user.company_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id:int,
    customer_in:CustomerUpdate,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user),
):
    customer=(
        db.query(Customer)
            .filter(Customer.id== customer_id ,Customer.company_id == current_user.company_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer_in: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sirf apni company ka customer update kar sakte hain."""
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.company_id == current_user.company_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = customer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sirf apni company ka customer delete kar sakte hain."""
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.company_id == current_user.company_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(customer)
    db.commit()
    return None

    