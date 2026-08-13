from fastapi import APIRouter, Depends
from app.api.deps.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.schemas.user import UserResponse

router = APIRouter()
@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user:User = Depends(get_current_user)):
    return current_user

@router.get("/admin-only")
def admin_only_route(current_user: User = Depends(require_role([UserRole.ADMIN]))):
    """Sirf Admin role access kar sakta hai."""
    return {"message": f"Welcome Admin {current_user.name}! Ye sirf tumhare liye hai."}


@router.get("/manager-and-admin")
def manager_and_admin_route(
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Admin aur Manager dono access kar sakte hain, Employee nahi."""
    return {"message": f"Hello {current_user.name}, tum {current_user.role.value} ho aur is route ko access kar sakte ho."}


@router.get("/all-roles")
def all_roles_route(current_user: User = Depends(get_current_user)):
    """Koi bhi logged-in user access kar sakta hai (Admin, Manager, ya Employee)."""
    return {"message": f"Hello {current_user.name}! Tum {current_user.role.value} ho, aur logged in ho."}

                