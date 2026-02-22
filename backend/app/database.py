"""
Local SQLite database with SQLAlchemy.
Lightweight, zero-config, file-based - perfect for single-user.
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, JSON, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime, timezone
from .config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
    echo=settings.debug,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- Models ---

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), default="Untitled Resume")
    full_name = Column(String(255), default="")
    email = Column(String(255), default="")
    phone = Column(String(50), default="")
    location = Column(String(255), default="")
    summary = Column(Text, default="")
    experience = Column(JSON, default=list)  # [{company, title, start, end, bullets}]
    education = Column(JSON, default=list)   # [{school, degree, field, start, end}]
    skills = Column(JSON, default=list)      # [str]
    certifications = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    raw_text = Column(Text, default="")
    file_path = Column(String(500), default="")
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company = Column(String(255), default="")
    job_title = Column(String(255), default="")
    description = Column(Text, default="")
    requirements = Column(JSON, default=list)
    extracted_skills = Column(JSON, default=list)
    salary_range = Column(String(100), default="")
    location = Column(String(255), default="")
    url = Column(String(500), default="")
    status = Column(String(50), default="saved")  # saved, applied, interviewing, offered, rejected
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, nullable=True)
    session_type = Column(String(50), default="behavioral")  # behavioral, technical, system_design
    status = Column(String(50), default="active")  # active, completed, cancelled
    messages = Column(JSON, default=list)  # [{role, content, timestamp}]
    feedback = Column(JSON, default=dict)  # {overall_score, strengths, improvements}
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(100), default="general")
    role = Column(String(50))  # user, assistant, system
    content = Column(Text)
    metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, nullable=True)
    resume_id = Column(Integer, nullable=True)
    content = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class AppSetting(Base):
    __tablename__ = "app_settings"

    key = Column(String(255), primary_key=True)
    value = Column(Text, default="")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
