from typing import Dict
from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_customers: int
    total_leads: int
    leads_by_status: Dict[str, int]
    total_tasks: int
    tasks_by_status: Dict[str, int]
    pending_tasks: int
    completed_tasks: int
    conversion_rate: float
