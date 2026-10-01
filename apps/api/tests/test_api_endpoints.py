import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import init_db

@pytest.fixture(autouse=True)
async def setup_database():
    await init_db()

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Nexora API"

@pytest.mark.asyncio
async def test_create_research_session_and_plan():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "question": "What is the impact of code AI assistants on software quality and security?",
            "depth": "standard"
        }
        res = await ac.post("/api/research", json=payload)
        assert res.status_code == 200
        session_data = res.json()
        assert "id" in session_data
        assert session_data["status"] == "ready"
        assert len(session_data["tasks"]) >= 3
        
        session_id = session_data["id"]
        
        # Test get session
        get_res = await ac.get(f"/api/research/{session_id}")
        assert get_res.status_code == 200
        get_data = get_res.json()
        assert get_data["id"] == session_id
        assert get_data["question"] == payload["question"]

@pytest.mark.asyncio
async def test_update_plan_tasks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create session
        res = await ac.post("/api/research", json={
            "question": "How do electric vehicles impact urban grid stability?",
            "depth": "quick"
        })
        assert res.status_code == 200
        session_id = res.json()["id"]
        
        # Update plan with custom sub-questions
        update_payload = {
            "questions": [
                {
                    "question": "What are peak load variations during evening residential charging?",
                    "priority": "high",
                    "evidence_requirements": ["transformer load profiles", "peak demand delta"]
                },
                {
                    "question": "How effective is smart bi-directional V2G technology at frequency regulation?",
                    "priority": "medium",
                    "evidence_requirements": ["frequency response time", "cycle degradation"]
                }
            ]
        }
        plan_res = await ac.put(f"/api/research/{session_id}/plan", json=update_payload)
        assert plan_res.status_code == 200
        updated = plan_res.json()
        assert len(updated["tasks"]) == 2
        assert "peak load" in updated["tasks"][0]["question"].lower()

@pytest.mark.asyncio
async def test_list_research_history():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/research")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        assert len(data) >= 1
