"""
CareerOS Backend - FastAPI application.

Single-user AI career assistant with:
- LangGraph agent orchestrator
- PersonaPlex avatar (NVIDIA GPU) or browser speech fallback
- SQLite local database
- Auto GPU detection (DGX Spark → NVIDIA → Apple Silicon → CPU)
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import settings
from .database import init_db
from .services.gpu_detect import detect_compute_backend, apply_gpu_config
from .services.personaplex import personaplex_service

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    logger.info("=" * 60)
    logger.info("CareerOS starting up...")
    logger.info("=" * 60)

    # 1. Detect GPU and configure compute backend
    gpu_info = detect_compute_backend()
    apply_gpu_config(gpu_info)
    app.state.gpu_info = gpu_info

    logger.info(f"Compute: {gpu_info.backend.value} | Device: {gpu_info.device_name}")

    # 2. Initialize database
    init_db()
    logger.info(f"Database: SQLite at {settings.database_url}")

    # 3. Initialize PersonaPlex
    capabilities = await personaplex_service.initialize()
    app.state.personaplex_capabilities = capabilities
    logger.info(f"PersonaPlex: avatar={capabilities['avatar_available']}, tts={capabilities['tts_available']}")

    # 4. Pre-warm LLM (lazy - will init on first request)
    logger.info(f"LLM: will use {gpu_info.recommended_model} (loaded on first request)")

    logger.info("=" * 60)
    logger.info(f"CareerOS ready at http://{settings.host}:{settings.port}")
    logger.info(f"Frontend expected at {settings.frontend_url}")
    logger.info("=" * 60)

    yield

    # --- Shutdown ---
    await personaplex_service.shutdown()
    logger.info("CareerOS shut down.")


app = FastAPI(
    title="CareerOS",
    description="AI-powered career assistant with PersonaPlex avatar",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
uploads_path = Path(settings.uploads_dir)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# --- Register routers ---
from .routers import chat, resume, jobs, interview

app.include_router(chat.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(interview.router)


# --- System endpoints ---

@app.get("/api/status")
async def system_status():
    """System status and capabilities for the dashboard."""
    gpu = getattr(app.state, "gpu_info", None)
    capabilities = getattr(app.state, "personaplex_capabilities", {})

    return {
        "status": "running",
        "compute_backend": gpu.backend.value if gpu else "unknown",
        "gpu_name": gpu.device_name if gpu else "unknown",
        "gpu_vram_gb": gpu.vram_gb if gpu else 0,
        "gpu_count": gpu.num_devices if gpu else 0,
        "personaplex": capabilities,
        "database": "sqlite",
        "llm_model": gpu.recommended_model if gpu else "unknown",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
