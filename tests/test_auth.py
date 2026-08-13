def test_register_success(client):
   
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
            "company_name": "Test Co",
            "company_email": "testco@example.com",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "admin"
    assert "password" not in data  # password kabhi response mein nahi aani chahiye


def test_register_duplicate_email_fails(client):
    """Same email se dobara register karne pe error aana chahiye."""
    payload = {
        "name": "Test User",
        "email": "dup@example.com",
        "password": "password123",
        "company_name": "Company A",
        "company_email": "a@example.com",
    }
    client.post("/api/v1/auth/register", json=payload)

    # Dobara same email se try karo
    payload["company_name"] = "Company B"
    payload["company_email"] = "b@example.com"
    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 400


def test_login_success(client):
    """Sahi credentials se login karne pe access token milna chahiye."""
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "password123",
            "company_name": "Login Co",
            "company_email": "loginco@example.com",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_fails(client):
    """Galat password se login karne pe 401 error aana chahiye."""
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Wrong Pass User",
            "email": "wrongpass@example.com",
            "password": "correctpassword",
            "company_name": "WP Co",
            "company_email": "wpco@example.com",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        data={"username": "wrongpass@example.com", "password": "wrongpassword"},
    )

    assert response.status_code == 401


            