from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import api_router

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.get("/", tags=["Health"])
def root():
    return {"message": f"{settings.PROJECT_NAME} is running", "status": "ok"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    