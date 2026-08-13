from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, customers, leads, tasks, companies, dashboard

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(leads.router, prefix="/leads", tags=["Leads"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
