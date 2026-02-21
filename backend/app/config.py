"""
Application configuration with GPU detection and automatic fallback.
Supports: NVIDIA DGX Spark GB10 → consumer NVIDIA GPU → Apple Silicon → CPU
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from enum import Enum
from pathlib import Path


class ComputeBackend(str, Enum):
    DGX_SPARK = "dgx_spark"
    NVIDIA_GPU = "nvidia_gpu"
    APPLE_SILICON = "apple_silicon"
    CPU = "cpu"


class Settings(BaseSettings):
    app_name: str = "ResumeGuru CareerOS"
    debug: bool = False

    # Database
    database_url: str = "sqlite:///./data/careeros.db"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"

    # PersonaPlex / NVIDIA NIM
    nim_api_base: str = "http://localhost:8010"
    nim_model: str = "meta/llama-3.1-70b-instruct"
    nim_api_key: str = ""

    # PersonaPlex Avatar
    personaplex_url: str = "http://localhost:8020"
    personaplex_avatar_id: str = "hannah"

    # Riva (speech services within PersonaPlex)
    riva_speech_url: str = "localhost:50051"
    riva_tts_voice: str = "English-US.Female-1"
    riva_asr_language: str = "en-US"

    # Fallback: local LLM for Apple Silicon / CPU
    local_model_path: str = "./models/llama-3.2-3b-instruct.Q4_K_M.gguf"
    local_model_n_gpu_layers: int = -1  # auto-detect
    local_model_n_ctx: int = 8192

    # Fallback: OpenAI-compatible API (for external API fallback)
    openai_api_key: str = ""
    openai_api_base: str = ""
    openai_model: str = "gpt-4o"

    # Compute - auto-detected at startup
    compute_backend: ComputeBackend = ComputeBackend.CPU

    # Data directory
    data_dir: str = "./data"
    uploads_dir: str = "./data/uploads"
    models_dir: str = "./models"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# Ensure data directories exist
Path(settings.data_dir).mkdir(parents=True, exist_ok=True)
Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)
Path(settings.models_dir).mkdir(parents=True, exist_ok=True)
