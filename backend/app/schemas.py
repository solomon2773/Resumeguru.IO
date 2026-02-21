"""Pydantic schemas for API request/response validation."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMessage(BaseModel):
    content: str
    session_id: str = "general"


class ChatResponse(BaseModel):
    content: str
    agent: str
    session_id: str


class ResumeCreate(BaseModel):
    title: str = "Untitled Resume"
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    summary: str = ""
    experience: list = []
    education: list = []
    skills: list = []
    certifications: list = []
    projects: list = []


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    experience: Optional[list] = None
    education: Optional[list] = None
    skills: Optional[list] = None
    certifications: Optional[list] = None
    projects: Optional[list] = None
    is_primary: Optional[bool] = None


class ResumeOut(BaseModel):
    id: int
    title: str
    full_name: str
    email: str
    phone: str
    location: str
    summary: str
    experience: list
    education: list
    skills: list
    certifications: list
    projects: list
    is_primary: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobCreate(BaseModel):
    company: str = ""
    job_title: str = ""
    description: str = ""
    requirements: list = []
    extracted_skills: list = []
    salary_range: str = ""
    location: str = ""
    url: str = ""
    status: str = "saved"
    notes: str = ""


class JobUpdate(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[list] = None
    extracted_skills: Optional[list] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class JobOut(BaseModel):
    id: int
    company: str
    job_title: str
    description: str
    requirements: list
    extracted_skills: list
    salary_range: str
    location: str
    url: str
    status: str
    notes: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewSessionOut(BaseModel):
    id: int
    job_id: Optional[int]
    session_type: str
    status: str
    messages: list
    feedback: dict
    score: Optional[float]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SystemStatus(BaseModel):
    compute_backend: str
    gpu_name: str
    personaplex_available: bool
    tts_available: bool
    asr_available: bool
    llm_provider: str
    database: str
