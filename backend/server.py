from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# =====================================================================
# Pin Context — live geoscience data for a lat/lng pin drop.
# Proxies three public-domain APIs server-side to bypass PBDB's missing
# CORS headers and to bundle three calls into one client round-trip.
#   1. Macrostrat  → rocks (formations, lithology, age)
#   2. PBDB        → fossils/life (species near the point)
#   3. USGS MRDS   → mineral resource sites (via general/near-point.php)
# =====================================================================

MACROSTRAT_URL = "https://macrostrat.org/api/geologic_units/map"
PBDB_URL = "https://paleobiodb.org/data1.2/occs/list.json"
USGS_NEARPOINT_URL = "https://mrdata.usgs.gov/general/near-point.php"


async def _fetch_macrostrat(client: httpx.AsyncClient, lat: float, lng: float) -> Dict[str, Any]:
    try:
        r = await client.get(
            MACROSTRAT_URL,
            params={"lat": lat, "lng": lng, "response": "long"},
            timeout=15.0,
        )
        r.raise_for_status()
        data = (r.json().get("success") or {}).get("data") or []
        rocks = []
        for u in data:
            descrip = (u.get("descrip") or "").strip()
            rocks.append({
                "name": u.get("name") or u.get("strat_name") or "Unnamed unit",
                "strat_name": u.get("strat_name") or "",
                "lithology": u.get("lith") or "",
                "age": u.get("best_int_name") or u.get("t_int_name") or "",
                "t_age": u.get("t_age"),
                "b_age": u.get("b_age"),
                "color": u.get("color") or "",
                "description": descrip[:400] + ("…" if len(descrip) > 400 else ""),
            })
        return {"source": "Macrostrat", "count": len(rocks), "items": rocks}
    except Exception as e:
        logger.warning("macrostrat fetch failed: %s", e)
        return {"source": "Macrostrat", "count": 0, "items": [], "error": str(e)[:120]}


async def _fetch_pbdb(client: httpx.AsyncClient, lat: float, lng: float) -> Dict[str, Any]:
    try:
        r = await client.get(
            PBDB_URL,
            params={
                "lngmin": lng - 0.5,
                "lngmax": lng + 0.5,
                "latmin": lat - 0.5,
                "latmax": lat + 0.5,
                "show": "class",
                "limit": 15,
            },
            timeout=20.0,
        )
        r.raise_for_status()
        records = r.json().get("records") or []
        life = []
        for rec in records:
            life.append({
                "taxon": rec.get("tna") or rec.get("idn") or "Unknown",
                "identified_as": rec.get("idn") or "",
                "phylum": rec.get("phl") or "",
                "class": rec.get("cll") or "",
                "order": rec.get("odl") or "",
                "family": rec.get("fml") or "",
                "early_interval": rec.get("oei") or "",
                "early_age_ma": rec.get("eag"),
                "late_age_ma": rec.get("lag"),
            })
        return {"source": "Paleobiology Database", "count": len(life), "items": life}
    except Exception as e:
        logger.warning("pbdb fetch failed: %s", e)
        return {"source": "Paleobiology Database", "count": 0, "items": [], "error": str(e)[:120]}


async def _fetch_usgs_mrds(client: httpx.AsyncClient, lat: float, lng: float) -> Dict[str, Any]:
    # Uses ~50 km tolerance (~0.5 deg latitude)
    try:
        r = await client.get(
            USGS_NEARPOINT_URL,
            params={"x": lng, "y": lat, "d": 0.5, "format": "json"},
            timeout=25.0,
        )
        r.raise_for_status()
        payload = r.json()
        # Find the "Mineral Resource Data System" dataset
        minerals: List[Dict[str, Any]] = []
        location_context: Dict[str, Any] = {}
        loc = payload.get("location") or {}
        ctx = (loc.get("context") or {})
        for fips in ctx.get("fips") or []:
            if fips.get("type") in ("state", "county", "country"):
                location_context[fips["type"]] = fips.get("name")
        for ds in payload.get("dataset") or []:
            if ds.get("title") == "Mineral Resource Data System":
                for rec in (ds.get("record_list") or [])[:20]:
                    minerals.append({
                        "site": rec.get("label") or "Site",
                        "development": rec.get("type") or "",
                        "commodities": (rec.get("comment") or "").strip(),
                        "url": rec.get("url") or "",
                    })
                break
        return {
            "source": "USGS MRDS (Mineral Resources Data System)",
            "count": len(minerals),
            "items": minerals,
            "location": location_context,
        }
    except Exception as e:
        logger.warning("usgs mrds fetch failed: %s", e)
        return {"source": "USGS MRDS", "count": 0, "items": [], "error": str(e)[:120]}


@api_router.get("/pin_context")
async def get_pin_context(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
):
    """Return real-world geologic + paleontologic + mineral data for a lat/lng."""
    async with httpx.AsyncClient(follow_redirects=True, headers={"User-Agent": "Strata-GeoExplorer/1.0"}) as client:
        rocks, life, minerals = await asyncio.gather(
            _fetch_macrostrat(client, lat, lng),
            _fetch_pbdb(client, lat, lng),
            _fetch_usgs_mrds(client, lat, lng),
        )
    return {
        "coordinates": {"lat": lat, "lng": lng},
        "location": minerals.get("location", {}),
        "rocks": rocks,
        "life": life,
        "minerals": minerals,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


# =====================================================================
# Field-Note submissions — one-button "Submit Find" flow.
# We store an authoritative copy in Mongo (permanent audit trail), then
# return deep-link URLs to PBDB Navigator and Mindat map centered on the
# submission coordinates so the contributor can complete the record in
# each upstream service with one additional tap.
# =====================================================================

class FindSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    location_name: str = ""
    find_type: str = "rock"   # rock | mineral | fossil
    notes: str = ""
    contributor: str = ""
    era_id: Optional[str] = None
    era_name: Optional[str] = None


@api_router.post("/submit_find")
async def submit_find(payload: FindSubmission):
    find_id = str(uuid.uuid4())
    doc = payload.model_dump()
    doc.update({
        "id": find_id,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    })
    try:
        await db.field_finds.insert_one(doc)
    except Exception as e:
        logger.warning("field_finds insert failed: %s", e)

    lat, lng = payload.lat, payload.lng
    # Route based on find_type:
    #   fossil  → PBDB only
    #   mineral → Mindat only
    #   rock or anything else → both
    ft = (payload.find_type or "").strip().lower()
    include_pbdb = ft in ("fossil",) or ft not in ("mineral",)
    include_mindat = ft in ("mineral",) or ft not in ("fossil",)
    # Explicit rock / unspecified → both handled by the above defaults

    pbdb_url = (
        f"https://paleobiodb.org/navigator/?a=basicMap&init=1&place={lat},{lng}"
        if include_pbdb else None
    )
    mindat_url = (
        f"https://www.mindat.org/mapsimplified.php?lat={lat}&long={lng}&z=10"
        if include_mindat else None
    )

    return {
        "id": find_id,
        "submitted": True,
        "message": "Find submitted to the scientific record.",
        "find_type": ft or "rock",
        "pbdb_url": pbdb_url,
        "mindat_url": mindat_url,
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()