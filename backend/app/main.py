from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AquaWatch API",
    description="Water pollution observation platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "aquawatch-api",
    }


@app.get("/api/reports")
def get_reports():
    # Temporary sample data; replace with database queries later.
    return [
        {
            "id": "demo-001",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "category": "plastic_waste",
            "confidence": 0.87,
            "observed_at": "2026-10-19",
            "source": "demo",
        },
        {
            "id": "demo-003",
            "latitude": 28.6200,
            "longitude": 77.2100,
            "category": "plastic_waste",
            "confidence": 0.82,
            "observed_at": "2026-10-20",
            "source": "demo",
        },
        {
            "id": "demo-004",
            "latitude": 28.6050,
            "longitude": 77.2000,
            "category": "visible_debris",
            "confidence": 0.76,
            "observed_at": "2026-10-21",
            "source": "demo",
        },
        {
            "id": "demo-002",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "category": "visible_debris",
            "confidence": 0.79,
            "observed_at": "2026-10-18",
            "source": "demo",
        },
    ]
