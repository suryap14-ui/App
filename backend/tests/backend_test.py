"""BVMCS Backend API tests"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://neural-makeover.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# Health check
def test_health(s):
    r = s.get(f"{API}/", timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("status") == "ok"
    assert "message" in data


# Chat: single message
def test_chat_single_message(s):
    r = s.post(f"{API}/chat", json={"message": "What services do you offer?"}, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "session_id" in data and isinstance(data["session_id"], str) and len(data["session_id"]) > 0
    assert "reply" in data and isinstance(data["reply"], str) and len(data["reply"]) > 5
    # Should mention something relevant
    low = data["reply"].lower()
    assert any(k in low for k in ["service", "design", "develop", "ui", "mobile", "backend", "frontend", "cloud"]), data["reply"]


# Chat: multi-turn conversation context
def test_chat_multi_turn_context(s):
    r1 = s.post(f"{API}/chat", json={"message": "My name is Alex and I'm building a fintech app."}, timeout=90)
    assert r1.status_code == 200, r1.text
    sid = r1.json()["session_id"]
    assert sid

    r2 = s.post(f"{API}/chat", json={"session_id": sid, "message": "What is my name?"}, timeout=90)
    assert r2.status_code == 200, r2.text
    reply = r2.json()["reply"].lower()
    assert "alex" in reply, f"Context not preserved. Reply: {reply}"
    assert r2.json()["session_id"] == sid


# Lead capture via /api/leads + GET persistence verification
def test_create_lead_and_persistence(s):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"TEST_Lead_{unique}",
        "email": f"test_{unique}@example.com",
        "source": "chatbot",
    }
    r = s.post(f"{API}/leads", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    lead = r.json()
    assert "id" in lead and lead["id"]
    assert lead["name"] == payload["name"]
    assert lead["email"] == payload["email"]
    assert lead["source"] == "chatbot"
    assert "created_at" in lead

    # GET /api/leads - verify persistence
    rg = s.get(f"{API}/leads", timeout=20)
    assert rg.status_code == 200, rg.text
    leads = rg.json()
    assert isinstance(leads, list)
    ids = [l["id"] for l in leads]
    assert lead["id"] in ids, "Newly created lead not present in GET /api/leads"


# Contact form: should overwrite source to contact_form
def test_contact_form(s):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"TEST_Contact_{unique}",
        "email": f"contact_{unique}@example.com",
        "company": "TestCo",
        "phone": "+1-555-0100",
        "message": "Need a quote for an app",
        "source": "chatbot",  # server should overwrite to contact_form
    }
    r = s.post(f"{API}/contact", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    lead = r.json()
    assert lead["source"] == "contact_form"
    assert lead["name"] == payload["name"]
    assert lead["email"] == payload["email"]
    assert lead["company"] == "TestCo"
    assert lead["message"] == payload["message"]
    assert "id" in lead


# Validation: invalid email should 422
def test_lead_invalid_email(s):
    r = s.post(f"{API}/leads", json={"name": "Bad", "email": "not-an-email"}, timeout=20)
    assert r.status_code in (400, 422), r.text


# Chat: missing message
def test_chat_missing_message(s):
    r = s.post(f"{API}/chat", json={}, timeout=20)
    assert r.status_code in (400, 422)
