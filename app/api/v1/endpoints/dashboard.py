from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.customer import Customer
from app.models.lead import Lead, LeadStatus
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.dashboard import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company_id = current_user.company_id

    total_customers = db.query(Customer).filter(Customer.company_id == company_id).count()

    total_leads = db.query(Lead).filter(Lead.company_id == company_id).count()

    leads_by_status_query = (
        db.query(Lead.status, func.count(Lead.id))
        .filter(Lead.company_id == company_id)
        .group_by(Lead.status)
        .all()
    )
    leads_by_status = {status.value: count for status, count in leads_by_status_query}
    for status_option in LeadStatus:
        leads_by_status.setdefault(status_option.value, 0)

    total_tasks = db.query(Task).filter(Task.company_id == company_id).count()

    tasks_by_status_query = (
        db.query(Task.status, func.count(Task.id))
        .filter(Task.company_id == company_id)
        .group_by(Task.status)
        .all()
    )
    tasks_by_status = {status.value: count for status, count in tasks_by_status_query}
    for status_option in TaskStatus:
        tasks_by_status.setdefault(status_option.value, 0)

    pending_tasks = tasks_by_status.get(TaskStatus.PENDING.value, 0) + tasks_by_status.get(TaskStatus.IN_PROGRESS.value, 0)
    completed_tasks = tasks_by_status.get(TaskStatus.COMPLETED.value, 0)

    converted_count = leads_by_status.get(LeadStatus.CONVERTED.value, 0)
    conversion_rate = round((converted_count / total_leads * 100), 2) if total_leads > 0 else 0.0

    return DashboardStats(
        total_customers=total_customers,
        total_leads=total_leads,
        leads_by_status=leads_by_status,
        total_tasks=total_tasks,
        tasks_by_status=tasks_by_status,
        pending_tasks=pending_tasks,
        completed_tasks=completed_tasks,
        conversion_rate=conversion_rate,
    )
