import logging

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app")


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Har HTTPException (404, 401, 403, 400, waghera) ko ek consistent
    JSON format mein badalta hai.
    """
    logger.warning(f"HTTP {exc.status_code} error at {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.detail,
            "path": str(request.url.path),
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Jab request body mein validation fail ho (jaise galat email format,
    missing required field), ye handler use-friendly message deta hai.
    """
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append({"field": field, "message": error["msg"]})

    logger.warning(f"Validation error at {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "message": "Validation failed",
            "details": errors,
            "path": str(request.url.path),
        },
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """
    Koi bhi unexpected error (jo humne khud nahi socha) yahan aata hai.
    User ko internal error details nahi dikhate (security ke liye),
    lekin server logs mein poora likha jata hai debugging ke liye.
    """
    logger.error(f"Unhandled error at {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "An unexpected error occurred. Please try again later.",
            "path": str(request.url.path),
        },
    )

    