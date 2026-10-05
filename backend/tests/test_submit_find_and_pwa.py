"""Backend tests for /api/submit_find routing and PWA static assets."""
import os
import requests
import pytest

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or "https://stone-era-map.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def s():
    return requests.Session()


class TestSubmitFindRouting:
    payload = {"lat": 39.74, "lng": -104.99, "location_name": "TEST_Denver", "notes": "auto", "contributor": "pytest"}

    def test_fossil_only_pbdb(self, s):
        r = s.post(f"{BASE_URL}/api/submit_find", json={**self.payload, "find_type": "fossil"}, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["submitted"] is True
        assert d["find_type"] == "fossil"
        assert d["pbdb_url"] and "paleobiodb.org" in d["pbdb_url"]
        assert d["mindat_url"] is None
        assert d["message"] == "Find submitted to the scientific record."

    def test_mineral_only_mindat(self, s):
        r = s.post(f"{BASE_URL}/api/submit_find", json={**self.payload, "find_type": "mineral"}, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["find_type"] == "mineral"
        assert d["mindat_url"] and "mindat.org" in d["mindat_url"]
        assert d["pbdb_url"] is None

    def test_rock_both_urls(self, s):
        r = s.post(f"{BASE_URL}/api/submit_find", json={**self.payload, "find_type": "rock"}, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["find_type"] == "rock"
        assert d["pbdb_url"] and d["mindat_url"]

    def test_invalid_lat_422(self, s):
        r = s.post(f"{BASE_URL}/api/submit_find", json={**self.payload, "lat": 999, "find_type": "rock"}, timeout=20)
        assert r.status_code == 422


class TestPWAAssets:
    def test_manifest(self, s):
        r = s.get(f"{BASE_URL}/manifest.json", timeout=15)
        assert r.status_code == 200
        m = r.json()
        assert m["name"] == "The Admiral's Log of Real Geology"
        assert m["short_name"] == "Admiral's Log"
        srcs = [i["src"] for i in m["icons"]]
        assert "/icon-192.png" in srcs and "/icon-512.png" in srcs

    def test_icon_192(self, s):
        r = s.get(f"{BASE_URL}/icon-192.png", timeout=15)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")

    def test_icon_512(self, s):
        r = s.get(f"{BASE_URL}/icon-512.png", timeout=15)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")

    def test_service_worker(self, s):
        r = s.get(f"{BASE_URL}/sw.js", timeout=15)
        assert r.status_code == 200
        assert "admirals-log-v2" in r.text

    def test_index_html_meta(self, s):
        r = s.get(f"{BASE_URL}/", timeout=15)
        assert r.status_code == 200
        html = r.text
        assert "<title>The Admiral&#x27;s Log of Real Geology</title>" in html or "The Admiral's Log of Real Geology" in html
        assert 'rel="manifest"' in html
        assert 'apple-mobile-web-app-title' in html
        assert '#1a1a2e' in html
