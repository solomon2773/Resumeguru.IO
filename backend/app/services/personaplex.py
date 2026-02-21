"""
NVIDIA PersonaPlex integration for interactive digital human avatar.

PersonaPlex combines:
- Audio2Face for lip-sync and facial animation
- Riva ASR for speech-to-text
- Riva TTS for text-to-speech
- NIM for LLM inference

On systems without NVIDIA GPU, speech features gracefully degrade
to browser-native Web Speech API (handled on frontend).
"""

import asyncio
import logging
import json
from dataclasses import dataclass, field
from enum import Enum
from typing import AsyncIterator

import httpx

from ..config import settings, ComputeBackend

logger = logging.getLogger(__name__)


class AvatarState(str, Enum):
    IDLE = "idle"
    LISTENING = "listening"
    THINKING = "thinking"
    SPEAKING = "speaking"


@dataclass
class PersonaPlexConfig:
    avatar_id: str = "hannah"
    voice_name: str = "English-US.Female-1"
    asr_language: str = "en-US"
    asr_model: str = "conformer"
    tts_sample_rate: int = 22050
    enable_audio2face: bool = True
    animation_fps: int = 30


@dataclass
class SpeechResult:
    text: str
    confidence: float = 0.0
    is_final: bool = True


@dataclass
class TTSChunk:
    audio_bytes: bytes
    viseme_data: list = field(default_factory=list)  # for Audio2Face lip-sync
    duration_ms: int = 0


class PersonaPlexService:
    """
    Manages PersonaPlex avatar services.
    Automatically adapts to available hardware.
    """

    def __init__(self):
        self.config = PersonaPlexConfig(
            avatar_id=settings.personaplex_avatar_id,
            voice_name=settings.riva_tts_voice,
            asr_language=settings.riva_asr_language,
        )
        self.available = False
        self.riva_available = False
        self.a2f_available = False
        self._http = httpx.AsyncClient(timeout=30.0)

    async def initialize(self) -> dict:
        """
        Probe PersonaPlex services and report availability.
        Returns a capabilities dict for the frontend to adapt UI.
        """
        capabilities = {
            "avatar_available": False,
            "tts_available": False,
            "asr_available": False,
            "audio2face_available": False,
            "compute_backend": settings.compute_backend.value,
            "fallback_mode": "browser_speech",
        }

        if settings.compute_backend not in (ComputeBackend.DGX_SPARK, ComputeBackend.NVIDIA_GPU):
            logger.info("No NVIDIA GPU - PersonaPlex disabled, using browser speech fallback")
            return capabilities

        # Check PersonaPlex service
        try:
            resp = await self._http.get(f"{settings.personaplex_url}/health", timeout=5)
            if resp.status_code == 200:
                self.available = True
                capabilities["avatar_available"] = True
                logger.info("PersonaPlex service available")
        except Exception as e:
            logger.warning(f"PersonaPlex not reachable: {e}")

        # Check Riva speech services
        try:
            resp = await self._http.get(f"http://{settings.riva_speech_url.replace(':50051', ':8001')}/v2/health/ready", timeout=5)
            if resp.status_code == 200:
                self.riva_available = True
                capabilities["tts_available"] = True
                capabilities["asr_available"] = True
                logger.info("Riva speech services available")
        except Exception:
            # Try gRPC health check
            try:
                import grpc
                channel = grpc.aio.insecure_channel(settings.riva_speech_url)
                from grpc_health.v1 import health_pb2, health_pb2_grpc
                stub = health_pb2_grpc.HealthStub(channel)
                resp = await stub.Check(health_pb2.HealthCheckRequest())
                if resp.status == health_pb2.HealthCheckResponse.SERVING:
                    self.riva_available = True
                    capabilities["tts_available"] = True
                    capabilities["asr_available"] = True
                await channel.close()
            except Exception as e:
                logger.warning(f"Riva speech not available: {e}")

        # Check Audio2Face
        if self.available:
            try:
                resp = await self._http.get(f"{settings.personaplex_url}/audio2face/health", timeout=5)
                if resp.status_code == 200:
                    self.a2f_available = True
                    capabilities["audio2face_available"] = True
            except Exception:
                pass

        if self.available:
            capabilities["fallback_mode"] = "none"
        elif self.riva_available:
            capabilities["fallback_mode"] = "riva_only"

        return capabilities

    async def text_to_speech(self, text: str) -> AsyncIterator[TTSChunk]:
        """
        Convert text to speech audio chunks with optional viseme data.
        Falls back gracefully if Riva is unavailable.
        """
        if not self.riva_available:
            # Return empty - frontend will use browser TTS
            return

        try:
            # Use Riva TTS via HTTP API
            payload = {
                "text": text,
                "voice_name": self.config.voice_name,
                "language_code": self.config.asr_language,
                "sample_rate_hz": self.config.tts_sample_rate,
                "encoding": "LINEAR_PCM",
            }

            async with self._http.stream(
                "POST",
                f"http://{settings.riva_speech_url.replace(':50051', ':8001')}/v1/tts",
                json=payload
            ) as response:
                async for chunk in response.aiter_bytes(chunk_size=4096):
                    yield TTSChunk(
                        audio_bytes=chunk,
                        viseme_data=[],
                        duration_ms=len(chunk) * 1000 // (self.config.tts_sample_rate * 2),
                    )

        except Exception as e:
            logger.warning(f"TTS failed, frontend should use browser TTS: {e}")

    async def speech_to_text_stream(self, audio_stream: AsyncIterator[bytes]) -> AsyncIterator[SpeechResult]:
        """
        Stream audio for real-time speech-to-text.
        Falls back to browser Web Speech API if unavailable.
        """
        if not self.riva_available:
            return

        try:
            # Use Riva ASR streaming
            async with self._http.stream(
                "POST",
                f"http://{settings.riva_speech_url.replace(':50051', ':8001')}/v1/asr/streaming",
                content=audio_stream,
                headers={"Content-Type": "audio/l16;rate=16000"},
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        data = json.loads(line)
                        yield SpeechResult(
                            text=data.get("transcript", ""),
                            confidence=data.get("confidence", 0.0),
                            is_final=data.get("is_final", False),
                        )
        except Exception as e:
            logger.warning(f"ASR streaming failed: {e}")

    async def get_avatar_state(self) -> dict:
        """Get current avatar animation state for frontend rendering."""
        if not self.available:
            return {"state": AvatarState.IDLE.value, "blendshapes": {}}

        try:
            resp = await self._http.get(f"{settings.personaplex_url}/avatar/{self.config.avatar_id}/state")
            return resp.json()
        except Exception:
            return {"state": AvatarState.IDLE.value, "blendshapes": {}}

    async def set_avatar_state(self, state: AvatarState) -> None:
        """Update avatar state (e.g., switch to listening/speaking)."""
        if not self.available:
            return

        try:
            await self._http.post(
                f"{settings.personaplex_url}/avatar/{self.config.avatar_id}/state",
                json={"state": state.value}
            )
        except Exception as e:
            logger.warning(f"Avatar state update failed: {e}")

    async def shutdown(self):
        await self._http.aclose()


# Singleton
personaplex_service = PersonaPlexService()
