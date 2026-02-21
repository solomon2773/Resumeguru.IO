"""
LLM provider with automatic fallback chain:
1. NVIDIA NIM (DGX Spark / NVIDIA GPU)
2. Local llama.cpp (Apple Silicon with Metal / CPU)
3. OpenAI-compatible API (external fallback)

Uses LangChain's ChatModel interface for unified access.
"""

import logging
from langchain_core.language_models import BaseChatModel

from ..config import settings, ComputeBackend

logger = logging.getLogger(__name__)

_llm_instance: BaseChatModel | None = None


def get_llm() -> BaseChatModel:
    """
    Get the LLM instance based on detected compute backend.
    Lazily initialized on first call.
    """
    global _llm_instance

    if _llm_instance is not None:
        return _llm_instance

    backend = settings.compute_backend

    # Try NIM first (NVIDIA GPU paths)
    if backend in (ComputeBackend.DGX_SPARK, ComputeBackend.NVIDIA_GPU):
        _llm_instance = _try_nim()
        if _llm_instance:
            return _llm_instance
        logger.warning("NIM not available, falling back...")

    # Try local llama.cpp (Apple Silicon or CPU)
    if backend in (ComputeBackend.APPLE_SILICON, ComputeBackend.CPU, ComputeBackend.DGX_SPARK, ComputeBackend.NVIDIA_GPU):
        _llm_instance = _try_local_llm()
        if _llm_instance:
            return _llm_instance
        logger.warning("Local LLM not available, falling back...")

    # External API fallback
    _llm_instance = _try_openai_compatible()
    if _llm_instance:
        return _llm_instance

    raise RuntimeError(
        "No LLM backend available. Please either:\n"
        "  1. Start NVIDIA NIM containers (for NVIDIA GPU)\n"
        "  2. Download a local model to ./models/ (for Apple Silicon/CPU)\n"
        "  3. Set OPENAI_API_KEY in .env (for external API)\n"
    )


def _try_nim() -> BaseChatModel | None:
    """Try NVIDIA NIM endpoint."""
    try:
        from langchain_nvidia_ai_endpoints import ChatNVIDIA
        llm = ChatNVIDIA(
            base_url=settings.nim_api_base,
            model=settings.nim_model,
            api_key=settings.nim_api_key or "not-needed-for-local",
            temperature=0.7,
            max_tokens=4096,
        )
        # Quick connectivity test
        llm.invoke("hi")
        logger.info(f"NIM LLM ready: {settings.nim_model} at {settings.nim_api_base}")
        return llm
    except Exception as e:
        logger.debug(f"NIM not available: {e}")
        return None


def _try_local_llm() -> BaseChatModel | None:
    """Try local llama.cpp model."""
    try:
        from pathlib import Path
        model_path = Path(settings.local_model_path)

        if not model_path.exists():
            # Check models directory for any .gguf file
            models_dir = Path(settings.models_dir)
            gguf_files = list(models_dir.glob("*.gguf"))
            if not gguf_files:
                logger.debug(f"No local model found at {model_path} or in {models_dir}")
                return None
            model_path = gguf_files[0]
            logger.info(f"Using discovered local model: {model_path.name}")

        from langchain_community.llms import LlamaCpp
        from langchain_core.language_models import BaseChatModel
        from langchain_community.chat_models import ChatLlamaCpp

        llm = ChatLlamaCpp(
            model_path=str(model_path),
            n_gpu_layers=settings.local_model_n_gpu_layers,
            n_ctx=settings.local_model_n_ctx,
            temperature=0.7,
            max_tokens=4096,
            verbose=settings.debug,
        )
        logger.info(f"Local LLM ready: {model_path.name} (GPU layers: {settings.local_model_n_gpu_layers})")
        return llm
    except ImportError:
        logger.debug("llama-cpp-python not installed")
        return None
    except Exception as e:
        logger.debug(f"Local LLM failed: {e}")
        return None


def _try_openai_compatible() -> BaseChatModel | None:
    """Try OpenAI-compatible API (including Azure, local servers, etc.)."""
    if not settings.openai_api_key:
        return None

    try:
        from langchain_community.chat_models import ChatOpenAI

        kwargs = {
            "model": settings.openai_model,
            "api_key": settings.openai_api_key,
            "temperature": 0.7,
            "max_tokens": 4096,
        }
        if settings.openai_api_base:
            kwargs["base_url"] = settings.openai_api_base

        llm = ChatOpenAI(**kwargs)
        logger.info(f"OpenAI-compatible LLM ready: {settings.openai_model}")
        return llm
    except Exception as e:
        logger.debug(f"OpenAI-compatible API failed: {e}")
        return None


def reset_llm():
    """Reset the LLM instance (e.g., after settings change)."""
    global _llm_instance
    _llm_instance = None
