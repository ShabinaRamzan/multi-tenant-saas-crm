from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_db
from app.models.company import Company
from app.models.user import User, UserRole
from app.schemas.user import UserRegister, UserResponse
from app.schemas.token import Token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_company = db.query(Company).filter(Company.email == user_in.company_email).first()
    if existing_company:
        raise HTTPException(status_code=400, detail="Company email already registered")

    new_company = Company(
        name=user_in.company_name,
        email=user_in.company_email,
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role=UserRole.ADMIN,
        company_id=new_company.id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")

    access_token = create_access_token(
        data={"sub": str(user.id), "company_id": user.company_id, "role": user.role.value}
    )

    return {"access_token": access_token, "token_type": "bearer"}
