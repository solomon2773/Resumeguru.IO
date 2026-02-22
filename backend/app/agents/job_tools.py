"""
AI-powered job analysis tools for the Job Agent.

These tools use the LLM to:
- Extract structured skills/requirements from job descriptions
- Analyze skill gaps between a resume and a JD
- Generate cover letters tailored to a specific job
"""

import json
import logging
from langchain_core.tools import tool
from sqlalchemy import desc

from ..database import SessionLocal, Resume, JobDescription, CoverLetter
from ..services.llm_provider import get_llm

logger = logging.getLogger(__name__)


@tool
def extract_jd_skills(job_id: int) -> str:
    """Extract required and preferred skills from a job description using AI.
    Updates the job record with extracted_skills and requirements."""
    db = SessionLocal()
    try:
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
        if not job:
            return json.dumps({"error": "Job not found"})
        if not job.description:
            return json.dumps({"error": "Job has no description to analyze"})

        llm = get_llm()
        prompt = f"""Extract structured information from this job description. Return ONLY valid JSON:
{{
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "requirements": ["requirement1", "requirement2"],
  "responsibilities": ["resp1", "resp2"],
  "experience_years": "string like '3-5 years' or 'not specified'",
  "education": "string like 'BS in CS' or 'not specified'",
  "keywords": ["key term 1", "key term 2"]
}}

JOB DESCRIPTION:
Title: {job.job_title} at {job.company}
{job.description[:5000]}"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        parsed = json.loads(content)

        # Update job with extracted data
        all_skills = parsed.get("required_skills", []) + parsed.get("preferred_skills", [])
        job.extracted_skills = all_skills
        job.requirements = parsed.get("requirements", [])
        db.commit()

        return json.dumps({"status": "extracted", "id": job.id, "data": parsed})

    except Exception as e:
        logger.error(f"JD extraction error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def analyze_skill_gap(resume_id: int, job_id: int) -> str:
    """Compare a resume's skills and experience against a job description.
    Identifies matching skills, missing skills, and provides a gap analysis."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()

        if not resume:
            return json.dumps({"error": "Resume not found"})
        if not job:
            return json.dumps({"error": "Job not found"})

        llm = get_llm()
        prompt = f"""Perform a detailed skill gap analysis comparing this resume against the job description.

JOB DESCRIPTION:
Title: {job.job_title} at {job.company}
Required Skills: {json.dumps(job.extracted_skills)}
Full Description: {job.description[:3000]}

RESUME:
Name: {resume.full_name}
Skills: {json.dumps(resume.skills)}
Summary: {resume.summary}
Experience: {json.dumps(resume.experience)[:2000]}
Education: {json.dumps(resume.education)}

Return ONLY valid JSON:
{{
  "match_score": <0-100 integer>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "transferable_skills": ["skill the candidate has that partially covers a requirement"],
  "experience_match": "strong/moderate/weak",
  "education_match": "meets/exceeds/below requirement",
  "top_gaps": [
    {{"skill": "name", "importance": "critical/important/nice-to-have", "recommendation": "how to acquire"}}
  ],
  "summary": "2-3 sentence overall assessment"
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
        logger.error(f"Skill gap analysis error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def generate_cover_letter(resume_id: int, job_id: int) -> str:
    """Generate a tailored cover letter for a specific job using resume data.
    Saves the cover letter to the database."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()

        if not resume:
            return json.dumps({"error": "Resume not found"})
        if not job:
            return json.dumps({"error": "Job not found"})

        llm = get_llm()
        prompt = f"""Write a professional, compelling cover letter for this job application.

APPLICANT:
Name: {resume.full_name}
Summary: {resume.summary}
Key Skills: {json.dumps(resume.skills[:15])}
Top Experience: {json.dumps(resume.experience[:3])[:1500]}

JOB:
Title: {job.job_title} at {job.company}
Description: {job.description[:2000]}

Guidelines:
- Address to "Hiring Manager" (unless company name is known, then use "Dear [Company] Hiring Team")
- Open with enthusiasm for the specific role
- Highlight 2-3 relevant achievements that match JD requirements
- Show knowledge of the company's work
- Close with a call to action
- Keep to 3-4 paragraphs
- Professional but personable tone

Return the cover letter text only (no JSON wrapping)."""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        cover_text = response.content.strip()

        # Save to database
        cover = CoverLetter(
            job_id=job.id,
            resume_id=resume.id,
            content=cover_text,
        )
        db.add(cover)
        db.commit()
        db.refresh(cover)

        return json.dumps({
            "status": "generated",
            "id": cover.id,
            "cover_letter": cover_text,
            "job_title": job.job_title,
            "company": job.company,
        })

    except Exception as e:
        logger.error(f"Cover letter generation error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


# Export all job AI tools
job_ai_tools = [extract_jd_skills, analyze_skill_gap, generate_cover_letter]
