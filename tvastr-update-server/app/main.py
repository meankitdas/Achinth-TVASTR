"""Tvastr Update Server — FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.update_routes import router as update_router
from app.routes.download_routes import router as download_router

app = FastAPI(
    title="Tvastr Update Server",
    description="License-gated update check and download API for Tvastr factory AI systems.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

# CORS — restrict to your domain in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: replace with your domain in production
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Register route groups under /api
app.include_router(update_router, prefix="/api")
app.include_router(download_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
