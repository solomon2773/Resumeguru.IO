"""Resume CRUD and AI-powered operations."""

import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db, Resume
from ..schemas import ResumeCreate, ResumeUpdate, ResumeOut
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/resumes", tags=["resumes"])


@router.get("/", response_model=list[ResumeOut])
def list_resumes(db: Session = Depends(get_db)):
    return db.query(Resume).order_by(desc(Resume.updated_at)).all()


@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.post("/", response_model=ResumeOut)
def create_resume(data: ResumeCreate, db: Session = Depends(get_db)):
    resume = Resume(**data.model_dump())
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.put("/{resume_id}", response_model=ResumeOut)
def update_resume(resume_id: int, data: ResumeUpdate, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(resume, key, val)

    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"status": "deleted"}


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a resume file (PDF/DOCX) and parse it."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("pdf", "docx", "doc", "txt"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")

    import os
    from pathlib import Path

    # Save file
    upload_dir = Path(settings.uploads_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text
    raw_text = ""
    if ext == "pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(str(file_path))
            raw_text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            logger.warning(f"PDF parsing failed: {e}")
            raw_text = ""
    elif ext in ("docx", "doc"):
        try:
            from docx import Document
            doc = Document(str(file_path))
            raw_text = "\n".join(p.text for p in doc.paragraphs)
        except Exception as e:
            logger.warning(f"DOCX parsing failed: {e}")
            raw_text = ""
    elif ext == "txt":
        raw_text = content.decode("utf-8", errors="ignore")

    # Create resume record with raw text
    resume = Resume(
        title=file.filename.rsplit(".", 1)[0],
        raw_text=raw_text,
        file_path=str(file_path),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "title": resume.title,
        "raw_text_length": len(raw_text),
        "message": "Resume uploaded. Use the chat to ask AI to parse and structure it.",
    }
