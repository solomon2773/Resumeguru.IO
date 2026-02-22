"""
LangChain tools available to all agents.
These connect agents to the local SQLite database and document processing.
"""

from langchain_core.tools import tool
from sqlalchemy import desc
from ..database import SessionLocal, Resume, JobDescription, InterviewSession, CoverLetter
import json
import logging

logger = logging.getLogger(__name__)


@tool
def search_resumes(query: str = "") -> str:
    """Search saved resumes. Returns all resumes if no query, or filters by title/name."""
    db = SessionLocal()
    try:
        q = db.query(Resume)
        if query:
            q = q.filter(
                (Resume.title.ilike(f"%{query}%")) |
                (Resume.full_name.ilike(f"%{query}%"))
            )
        resumes = q.order_by(desc(Resume.updated_at)).limit(10).all()
        return json.dumps([{
            "id": r.id,
            "title": r.title,
            "full_name": r.full_name,
            "email": r.email,
            "summary": r.summary[:200] if r.summary else "",
            "skills": r.skills,
            "is_primary": r.is_primary,
        } for r in resumes])
    finally:
        db.close()


@tool
def get_resume_detail(resume_id: int) -> str:
    """Get full details of a specific resume by ID."""
    db = SessionLocal()
    try:
        r = db.query(Resume).filter(Resume.id == resume_id).first()
        if not r:
            return json.dumps({"error": "Resume not found"})
        return json.dumps({
            "id": r.id,
            "title": r.title,
            "full_name": r.full_name,
            "email": r.email,
            "phone": r.phone,
            "location": r.location,
            "summary": r.summary,
            "experience": r.experience,
            "education": r.education,
            "skills": r.skills,
            "certifications": r.certifications,
            "projects": r.projects,
        })
    finally:
        db.close()


@tool
def save_resume(data: str) -> str:
    """Save or update a resume. Input is JSON with resume fields. Include 'id' to update existing."""
    db = SessionLocal()
    try:
        parsed = json.loads(data)
        resume_id = parsed.pop("id", None)

        if resume_id:
            resume = db.query(Resume).filter(Resume.id == resume_id).first()
            if not resume:
                return json.dumps({"error": "Resume not found"})
            for key, val in parsed.items():
                if hasattr(resume, key):
                    setattr(resume, key, val)
        else:
            resume = Resume(**{k: v for k, v in parsed.items() if hasattr(Resume, k)})
            db.add(resume)

        db.commit()
        db.refresh(resume)
        return json.dumps({"status": "saved", "id": resume.id})
    except Exception as e:
        db.rollback()
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def search_jobs(query: str = "") -> str:
    """Search saved job descriptions. Returns recent jobs if no query."""
    db = SessionLocal()
    try:
        q = db.query(JobDescription)
        if query:
            q = q.filter(
                (JobDescription.company.ilike(f"%{query}%")) |
                (JobDescription.job_title.ilike(f"%{query}%")) |
                (JobDescription.description.ilike(f"%{query}%"))
            )
        jobs = q.order_by(desc(JobDescription.updated_at)).limit(10).all()
        return json.dumps([{
            "id": j.id,
            "company": j.company,
            "job_title": j.job_title,
            "status": j.status,
            "location": j.location,
            "extracted_skills": j.extracted_skills,
            "description": j.description[:300] if j.description else "",
        } for j in jobs])
    finally:
        db.close()


@tool
def save_job(data: str) -> str:
    """Save or update a job description. Input is JSON with job fields. Include 'id' to update existing."""
    db = SessionLocal()
    try:
        parsed = json.loads(data)
        job_id = parsed.pop("id", None)

        if job_id:
            job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
            if not job:
                return json.dumps({"error": "Job not found"})
            for key, val in parsed.items():
                if hasattr(job, key):
                    setattr(job, key, val)
        else:
            job = JobDescription(**{k: v for k, v in parsed.items() if hasattr(JobDescription, k)})
            db.add(job)

        db.commit()
        db.refresh(job)
        return json.dumps({"status": "saved", "id": job.id})
    except Exception as e:
        db.rollback()
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def get_interview_history(limit: int = 5) -> str:
    """Get recent interview sessions with scores and feedback."""
    db = SessionLocal()
    try:
        sessions = db.query(InterviewSession).order_by(
            desc(InterviewSession.created_at)
        ).limit(limit).all()
        return json.dumps([{
            "id": s.id,
            "job_id": s.job_id,
            "session_type": s.session_type,
            "status": s.status,
            "score": s.score,
            "feedback": s.feedback,
            "message_count": len(s.messages) if s.messages else 0,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        } for s in sessions])
    finally:
        db.close()


@tool
def save_interview_session(data: str) -> str:
    """Save or update an interview session. Input is JSON."""
    db = SessionLocal()
    try:
        parsed = json.loads(data)
        session_id = parsed.pop("id", None)

        if session_id:
            session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
            if not session:
                return json.dumps({"error": "Session not found"})
            for key, val in parsed.items():
                if hasattr(session, key):
                    setattr(session, key, val)
        else:
            session = InterviewSession(**{k: v for k, v in parsed.items() if hasattr(InterviewSession, k)})
            db.add(session)

        db.commit()
        db.refresh(session)
        return json.dumps({"status": "saved", "id": session.id})
    except Exception as e:
        db.rollback()
        return json.dumps({"error": str(e)})
    finally:
        db.close()


# Collect all tools for agents
all_tools = [
    search_resumes,
    get_resume_detail,
    save_resume,
    search_jobs,
    save_job,
    get_interview_history,
    save_interview_session,
]

resume_tools = [search_resumes, get_resume_detail, save_resume]
job_tools = [search_jobs, save_job]
interview_tools = [search_jobs, get_resume_detail, get_interview_history, save_interview_session]
