import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import Base, get_db

# Test ke liye ek alag, temporary SQLite database (sirf memory mein, disk pe nahi)
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Asal database ki jagah, tests ke liye test database use karta hai."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Har test se pehle fresh tables banata hai, test khatam hone par sab clean kar deta hai."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Har test ke liye ek fresh TestClient deta hai, jisse hum API ko 'fake requests' bhej sakte hain."""
    with TestClient(app) as c:
        yield c



            