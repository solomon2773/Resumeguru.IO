"""
AI-powered interview tools for the Interview and Feedback Agents.

These tools use the LLM to:
- Generate role-specific interview questions from a JD
- Evaluate interview answers with structured scoring
- Provide detailed feedback with improvement suggestions
"""

import json
import logging
from langchain_core.tools import tool
from sqlalchemy import desc

from ..database import SessionLocal, Resume, JobDescription, InterviewSession
from ..services.llm_provider import get_llm

logger = logging.getLogger(__name__)


@tool
def generate_interview_questions(job_id: int, question_type: str = "mixed", count: int = 5) -> str:
    """Generate interview questions based on a job description.
    question_type: 'behavioral', 'technical', 'system_design', or 'mixed'."""
    db = SessionLocal()
    try:
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
        if not job:
            return json.dumps({"error": "Job not found"})

        llm = get_llm()
        prompt = f"""Generate {count} interview questions for this role.

JOB:
Title: {job.job_title} at {job.company}
Skills Required: {json.dumps(job.extracted_skills)}
Description: {job.description[:3000]}

Question type: {question_type}

For each question, provide context on what the interviewer is looking for.

Return ONLY valid JSON:
[
  {{
    "question": "the interview question",
    "type": "behavioral|technical|system_design",
    "difficulty": "easy|medium|hard",
    "what_to_look_for": "what makes a good answer",
    "sample_answer_outline": "brief outline of a strong answer"
  }}
]"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        questions = json.loads(content)
        return json.dumps({
            "job_title": job.job_title,
            "company": job.company,
            "question_type": question_type,
            "questions": questions,
        })

    except Exception as e:
        logger.error(f"Question generation error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def evaluate_interview_answer(question: str, answer: str, job_context: str = "") -> str:
    """Evaluate an interview answer with structured scoring and feedback.
    Returns scores for relevance, structure, specificity, and communication."""
    try:
        llm = get_llm()
        prompt = f"""Evaluate this interview answer. Be constructive — highlight strengths before suggesting improvements.

QUESTION: {question}

CANDIDATE'S ANSWER: {answer}

{f'JOB CONTEXT: {job_context}' if job_context else ''}

Evaluate on these criteria:
1. Relevance (0-10): Does it address the question directly?
2. Structure (0-10): Is it well-organized? (STAR method for behavioral, logical flow for technical)
3. Specificity (0-10): Are there concrete examples, metrics, and details?
4. Communication (0-10): Is it clear, concise, and professional?

Return ONLY valid JSON:
{{
  "overall_score": <0-10 float, weighted average>,
  "relevance": {{"score": <0-10>, "comment": "brief note"}},
  "structure": {{"score": <0-10>, "comment": "brief note"}},
  "specificity": {{"score": <0-10>, "comment": "brief note"}},
  "communication": {{"score": <0-10>, "comment": "brief note"}},
  "strengths": ["what the candidate did well"],
  "improvements": ["specific suggestion for improvement"],
  "improved_answer_tip": "one key thing to change for a significantly better answer"
}}"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)
        return json.dumps(result)

    except Exception as e:
        logger.error(f"Answer evaluation error: {e}")
        return json.dumps({"error": str(e)})


@tool
def score_interview_session(session_id: int) -> str:
    """Calculate overall score for a completed interview session.
    Analyzes all Q&A pairs and provides comprehensive feedback."""
    db = SessionLocal()
    try:
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        if not session:
            return json.dumps({"error": "Session not found"})
        if not session.messages:
            return json.dumps({"error": "Session has no messages to score"})

        llm = get_llm()

        # Build conversation summary
        conversation = ""
        for msg in session.messages[-20:]:  # Last 20 messages
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            conversation += f"{role.upper()}: {content}\n\n"

        prompt = f"""Score this mock interview session overall.

INTERVIEW TYPE: {session.session_type}

CONVERSATION:
{conversation[:4000]}

Return ONLY valid JSON:
{{
  "overall_score": <0-100 integer>,
  "technical_score": <0-100>,
  "communication_score": <0-100>,
  "confidence_score": <0-100>,
  "strengths": ["top strengths demonstrated"],
  "areas_to_improve": ["areas needing work"],
  "recommendation": "specific advice for next interview",
  "grade": "A/B/C/D/F"
}}"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)

        # Update session with score
        session.score = result.get("overall_score", 0) / 10.0  # Normalize to 0-10
        session.feedback = result
        session.status = "completed"
        db.commit()

        return json.dumps(result)

    except Exception as e:
        logger.error(f"Session scoring error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


# Export all interview AI tools
interview_ai_tools = [generate_interview_questions, evaluate_interview_answer, score_interview_session]
