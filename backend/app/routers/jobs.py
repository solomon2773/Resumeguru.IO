"""Job description CRUD and tracking."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db, JobDescription
from ..schemas import JobCreate, JobUpdate, JobOut

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/", response_model=list[JobOut])
def list_jobs(status: str = "", db: Session = Depends(get_db)):
    q = db.query(JobDescription)
    if status:
        q = q.filter(JobDescription.status == status)
    return q.order_by(desc(JobDescription.updated_at)).all()


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/", response_model=JobOut)
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    job = JobDescription(**data.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, data: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(job, key, val)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"status": "deleted"}


@router.get("/stats/summary")
def job_stats(db: Session = Depends(get_db)):
    """Quick stats for the dashboard."""
    total = db.query(JobDescription).count()
    by_status = {}
    for status in ["saved", "applied", "interviewing", "offered", "rejected"]:
        by_status[status] = db.query(JobDescription).filter(JobDescription.status == status).count()
    return {"total": total, "by_status": by_status}
