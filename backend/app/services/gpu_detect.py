"""
GPU detection and automatic compute backend selection.

Priority order:
1. NVIDIA DGX Spark GB10 (2x) - full PersonaPlex + NIM
2. NVIDIA consumer/datacenter GPU - NIM microservices
3. Apple Silicon (M3/M4/M5) - local llama.cpp with Metal
4. CPU only - local llama.cpp (slow) or external API fallback
"""

import platform
import subprocess
import logging
from dataclasses import dataclass
from ..config import settings, ComputeBackend

logger = logging.getLogger(__name__)


@dataclass
class GPUInfo:
    backend: ComputeBackend
    device_name: str
    vram_gb: float
    compute_capability: str
    num_devices: int
    supports_personaplex: bool
    supports_nim: bool
    recommended_model: str


def _detect_nvidia() -> GPUInfo | None:
    """Check for NVIDIA GPUs via nvidia-smi."""
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total,compute_cap", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode != 0:
            return None

        lines = [l.strip() for l in result.stdout.strip().split("\n") if l.strip()]
        if not lines:
            return None

        gpus = []
        for line in lines:
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 3:
                gpus.append({
                    "name": parts[0],
                    "vram_mb": float(parts[1]),
                    "compute_cap": parts[2],
                })

        if not gpus:
            return None

        total_vram_gb = sum(g["vram_mb"] for g in gpus) / 1024.0
        primary = gpus[0]
        name_lower = primary["name"].lower()

        # DGX Spark GB10 detection
        is_dgx_spark = any(
            kw in name_lower
            for kw in ["gb10", "gb200", "dgx spark", "grace blackwell"]
        )

        if is_dgx_spark:
            return GPUInfo(
                backend=ComputeBackend.DGX_SPARK,
                device_name=primary["name"],
                vram_gb=total_vram_gb,
                compute_capability=primary["compute_cap"],
                num_devices=len(gpus),
                supports_personaplex=True,
                supports_nim=True,
                recommended_model="meta/llama-3.1-70b-instruct",
            )

        # Any other NVIDIA GPU with enough VRAM for NIM
        supports_nim = total_vram_gb >= 8.0
        supports_personaplex = total_vram_gb >= 16.0

        recommended = "meta/llama-3.1-70b-instruct" if total_vram_gb >= 40 else \
                      "meta/llama-3.1-8b-instruct" if total_vram_gb >= 8 else \
                      "local"

        return GPUInfo(
            backend=ComputeBackend.NVIDIA_GPU,
            device_name=primary["name"],
            vram_gb=total_vram_gb,
            compute_capability=primary["compute_cap"],
            num_devices=len(gpus),
            supports_personaplex=supports_personaplex,
            supports_nim=supports_nim,
            recommended_model=recommended,
        )

    except (FileNotFoundError, subprocess.TimeoutExpired):
        return None
    except Exception as e:
        logger.warning(f"NVIDIA detection error: {e}")
        return None


def _detect_apple_silicon() -> GPUInfo | None:
    """Check for Apple Silicon (M3/M4/M5) via sysctl."""
    if platform.system() != "Darwin":
        return None

    try:
        result = subprocess.run(
            ["sysctl", "-n", "machdep.cpu.brand_string"],
            capture_output=True, text=True, timeout=5
        )
        brand = result.stdout.strip()

        if "Apple" not in brand:
            return None

        # Detect chip generation
        chip_name = brand  # e.g. "Apple M4 Max"

        # Get unified memory size
        mem_result = subprocess.run(
            ["sysctl", "-n", "hw.memsize"],
            capture_output=True, text=True, timeout=5
        )
        mem_bytes = int(mem_result.stdout.strip())
        mem_gb = mem_bytes / (1024**3)

        # Apple Silicon can share ~75% of unified memory with GPU
        gpu_available_gb = mem_gb * 0.75

        recommended = "local"  # Always use local llama.cpp on Apple Silicon

        return GPUInfo(
            backend=ComputeBackend.APPLE_SILICON,
            device_name=chip_name,
            vram_gb=gpu_available_gb,
            compute_capability="metal",
            num_devices=1,
            supports_personaplex=False,  # PersonaPlex requires NVIDIA
            supports_nim=False,
            recommended_model=recommended,
        )

    except Exception as e:
        logger.warning(f"Apple Silicon detection error: {e}")
        return None


def detect_compute_backend() -> GPUInfo:
    """
    Auto-detect the best available compute backend.
    Returns GPUInfo with the recommended configuration.
    """
    # Try NVIDIA first (DGX Spark or consumer GPU)
    nvidia = _detect_nvidia()
    if nvidia:
        logger.info(f"Detected NVIDIA: {nvidia.device_name} ({nvidia.vram_gb:.1f}GB VRAM, {nvidia.num_devices} device(s))")
        logger.info(f"Backend: {nvidia.backend.value} | PersonaPlex: {nvidia.supports_personaplex} | NIM: {nvidia.supports_nim}")
        return nvidia

    # Try Apple Silicon
    apple = _detect_apple_silicon()
    if apple:
        logger.info(f"Detected Apple Silicon: {apple.device_name} ({apple.vram_gb:.1f}GB available)")
        logger.info(f"Backend: {apple.backend.value} | Using local llama.cpp with Metal")
        return apple

    # CPU fallback
    logger.info("No GPU detected - falling back to CPU mode")
    return GPUInfo(
        backend=ComputeBackend.CPU,
        device_name=platform.processor() or "Unknown CPU",
        vram_gb=0,
        compute_capability="none",
        num_devices=0,
        supports_personaplex=False,
        supports_nim=False,
        recommended_model="local",
    )


def apply_gpu_config(gpu_info: GPUInfo) -> None:
    """Apply detected GPU configuration to app settings."""
    settings.compute_backend = gpu_info.backend

    if gpu_info.backend == ComputeBackend.DGX_SPARK:
        # Full PersonaPlex stack on DGX Spark
        settings.nim_model = gpu_info.recommended_model
        logger.info("Configured for DGX Spark: full PersonaPlex + NIM stack")

    elif gpu_info.backend == ComputeBackend.NVIDIA_GPU:
        settings.nim_model = gpu_info.recommended_model
        if not gpu_info.supports_personaplex:
            logger.info("GPU has limited VRAM - PersonaPlex avatar disabled, NIM text-only mode")
        logger.info(f"Configured for NVIDIA GPU: NIM model={settings.nim_model}")

    elif gpu_info.backend == ComputeBackend.APPLE_SILICON:
        # Use llama.cpp with Metal acceleration
        settings.local_model_n_gpu_layers = -1  # offload all layers to Metal
        logger.info("Configured for Apple Silicon: llama.cpp with Metal acceleration")

    else:
        # CPU - use llama.cpp without GPU or external API
        settings.local_model_n_gpu_layers = 0
        logger.info("Configured for CPU: llama.cpp (CPU-only) or external API fallback")
