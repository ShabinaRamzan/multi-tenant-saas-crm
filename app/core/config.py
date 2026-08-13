from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Multi-Tenant CRM Backend"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()

        