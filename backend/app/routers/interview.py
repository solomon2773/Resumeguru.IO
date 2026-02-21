"""Interview session management."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db, InterviewSession
from ..schemas import InterviewSessionOut

router = APIRouter(prefix="/api/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewSessionOut])
def list_sessions(db: Session = Depends(get_db)):
    return db.query(InterviewSession).order_by(desc(InterviewSession.created_at)).limit(20).all()


@router.get("/{session_id}", response_model=InterviewSessionOut)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"status": "deleted"}


@router.get("/stats/summary")
def interview_stats(db: Session = Depends(get_db)):
    """Quick stats for the dashboard."""
    total = db.query(InterviewSession).count()
    completed = db.query(InterviewSession).filter(InterviewSession.status == "completed").count()

    sessions = db.query(InterviewSession).filter(
        InterviewSession.score.isnot(None)
    ).order_by(desc(InterviewSession.created_at)).limit(10).all()

    avg_score = sum(s.score for s in sessions) / len(sessions) if sessions else 0
    scores = [{"date": s.created_at.isoformat() if s.created_at else "", "score": s.score} for s in sessions]

    return {
        "total": total,
        "completed": completed,
        "average_score": round(avg_score, 1),
        "recent_scores": scores,
    }
