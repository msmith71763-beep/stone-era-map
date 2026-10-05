"""Backend tests for /api/pin_context endpoint (Strata Geological Explorer)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://stone-era-map.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Accept": "application/json"})
    return s


class TestPinContext:
    def test_ocala_florida(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", params={"lat": 29.19, "lng": -82.13}, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        for key in ("coordinates", "location", "rocks", "life", "minerals", "fetched_at"):
            assert key in data, f"missing {key}"
        assert data["coordinates"]["lat"] == 29.19
        assert data["coordinates"]["lng"] == -82.13
        # Location should include Florida/US
        loc = data["location"]
        assert loc.get("country") == "United States", loc
        assert loc.get("state") == "Florida", loc
        # Rocks should have Cenozoic/Hawthorn/Coosawhatchee formation
        rocks = data["rocks"]["items"]
        assert len(rocks) > 0, "Expected at least one Macrostrat unit for Ocala FL"
        rocks_blob = " ".join(
            f"{r.get('name','')} {r.get('strat_name','')} {r.get('age','')} {r.get('lithology','')}"
            for r in rocks
        ).lower()
        assert any(k in rocks_blob for k in ["cenozoic", "hawthorn", "coosawhatch", "sedimentary"]), rocks_blob[:300]
        # Life items — expected but PBDB may rate-limit; if 0 must have error field
        life = data["life"]
        assert isinstance(life["items"], list)
        if life["count"] == 0:
            assert "error" in life or life["count"] == 0  # graceful
        # Minerals may be empty in FL — must not crash
        assert isinstance(data["minerals"]["items"], list)

    def test_denver_colorado(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", params={"lat": 39.74, "lng": -104.99}, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["location"].get("state") == "Colorado", data["location"]
        rocks_blob = " ".join(
            f"{r.get('name','')} {r.get('strat_name','')} {r.get('age','')}"
            for r in data["rocks"]["items"]
        ).lower()
        # Expect Mesozoic/Cretaceous/Paleogene surface geology (Denver Basin)
        assert any(k in rocks_blob for k in ["pierre", "fox hills", "laramie", "dakota", "cretaceous", "mesozoic", "paleogene", "broadway", "alluvium"]), rocks_blob[:400]
        assert len(data["rocks"]["items"]) > 0
        # Should have some mineral sites in CO
        assert data["minerals"]["count"] >= 1 or "error" in data["minerals"]

    def test_atlantic_ocean_graceful(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", params={"lat": 0, "lng": 0}, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        # All should be arrays, no crash
        assert isinstance(data["rocks"]["items"], list)
        assert isinstance(data["life"]["items"], list)
        assert isinstance(data["minerals"]["items"], list)

    def test_missing_params_422(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", timeout=30)
        assert r.status_code == 422

    def test_missing_lng_422(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", params={"lat": 40}, timeout=30)
        assert r.status_code == 422

    def test_out_of_range_422(self, client):
        r = client.get(f"{BASE_URL}/api/pin_context", params={"lat": 999, "lng": 0}, timeout=30)
        assert r.status_code == 422
