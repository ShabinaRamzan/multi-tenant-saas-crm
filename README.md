# Multi-Tenant SaaS CRM

A production-ready Multi-Tenant CRM where multiple companies use the same application while keeping their data completely isolated. Built with FastAPI, PostgreSQL, and React.

## Features

- JWT Authentication with role-based access control (Admin, Manager, Employee)
- Multi-tenancy — every query is automatically scoped to the logged-in user's company
- Customer, Lead, and Task management (full CRUD)
- Dashboard with real-time business stats
- Automated tests with Pytest
- Fully Dockerized

## Tech Stack

**Backend:** FastAPI, PostgreSQL, SQLAlchemy, Alembic, JWT
**Frontend:** React, Tailwind CSS
**Infra:** Docker

## Getting Started

```bash
git clone https://github.com/ShabinaRamzan/multi-tenant-saas-crm.git
cd multi-tenant-saas-crm
cp .env.example .env
docker compose up --build
docker compose exec app alembic upgrade head
```

API docs: `http://localhost:8000/docs`

Frontend:
```bash
cd crm-frontend/frontend
npm install
npm run dev
```

## Multi-Tenancy

Every record is scoped to a `company_id`, taken from the user's JWT token. A user can never access another company's data — even by guessing record IDs.

## License

MIT
