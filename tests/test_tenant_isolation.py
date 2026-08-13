def register_and_login(client, name, email, password, company_name, company_email):
    """Helper function \u2014 register + login ek sath karke token deta hai."""
    client.post(
        "/api/v1/auth/register",
        json={
            "name": name,
            "email": email,
            "password": password,
            "company_name": company_name,
            "company_email": company_email,
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": password},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_company_cannot_see_other_companys_customers(client):
    """
    Ye humara sabse zaroori test hai: Company A ke customers,
    Company B ko kabhi nahi dikhne chahiye.
    """
    # Company A banao aur ek customer add karo
    headers_a = register_and_login(
        client, "Admin A", "admina@example.com", "password123", "Company A", "compa@example.com"
    )
    client.post(
        "/api/v1/customers/",
        json={"name": "Customer of A"},
        headers=headers_a,
    )

    # Company B banao aur ek customer add karo
    headers_b = register_and_login(
        client, "Admin B", "adminb@example.com", "password123", "Company B", "compb@example.com"
    )
    client.post(
        "/api/v1/customers/",
        json={"name": "Customer of B"},
        headers=headers_b,
    )

    # Company A apna data dekhe \u2014 sirf apna customer dikhna chahiye
    response_a = client.get("/api/v1/customers/", headers=headers_a)
    names_a = [c["name"] for c in response_a.json()]
    assert "Customer of A" in names_a
    assert "Customer of B" not in names_a  # \u2b05 sabse zaroori check

    # Company B apna data dekhe \u2014 sirf apna customer dikhna chahiye
    response_b = client.get("/api/v1/customers/", headers=headers_b)
    names_b = [c["name"] for c in response_b.json()]
    assert "Customer of B" in names_b
    assert "Customer of A" not in names_b  # \u2b05 sabse zaroori check


def test_cannot_access_other_companys_customer_by_id(client):
    """
    Chahe ID guess bhi kar le, Company A, Company B ka specific
    customer record access nahi kar sakti \u2014 404 milna chahiye.
    """
    headers_a = register_and_login(
        client, "Admin C", "adminc@example.com", "password123", "Company C", "compc@example.com"
    )

    headers_b = register_and_login(
        client, "Admin D", "admind@example.com", "password123", "Company D", "compd@example.com"
    )
    create_response = client.post(
        "/api/v1/customers/",
        json={"name": "Secret Customer of D"},
        headers=headers_b,
    )
    customer_d_id = create_response.json()["id"]

    # Company A, Company D ke customer ki ID try kare
    response = client.get(f"/api/v1/customers/{customer_d_id}", headers=headers_a)

    assert response.status_code == 404  # milna hi nahi chahiye, chahe ID sahi ho


        