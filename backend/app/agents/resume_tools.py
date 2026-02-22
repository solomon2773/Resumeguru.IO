"""
AI-powered resume tools for the Resume Agent.

These tools use the LLM to do real intelligence work:
- Parse raw resume text into structured fields
- Optimize resume bullets for a target JD
- Calculate ATS keyword match scores
"""

import json
import logging
from langchain_core.tools import tool
from sqlalchemy import desc

from ..database import SessionLocal, Resume, JobDescription
from ..services.llm_provider import get_llm

logger = logging.getLogger(__name__)


@tool
def parse_resume_text(resume_id: int) -> str:
    """Parse a resume's raw text into structured fields using AI.
    Call this after a resume is uploaded to extract name, email, experience, skills, etc."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            return json.dumps({"error": "Resume not found"})
        if not resume.raw_text:
            return json.dumps({"error": "Resume has no raw text to parse"})

        llm = get_llm()
        prompt = f"""Extract structured information from this resume text. Return ONLY valid JSON with these fields:
{{
  "full_name": "string",
  "email": "string or empty",
  "phone": "string or empty",
  "location": "string or empty",
  "summary": "professional summary paragraph",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {{
      "company": "string",
      "title": "string",
      "start_date": "string",
      "end_date": "string or Present",
      "bullets": ["achievement 1", "achievement 2"]
    }}
  ],
  "education": [
    {{
      "school": "string",
      "degree": "string",
      "field": "string",
      "start_date": "string",
      "end_date": "string"
    }}
  ],
  "certifications": ["cert1", "cert2"]
}}

Resume text:
{resume.raw_text[:6000]}"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        # Extract JSON from response (handle markdown code blocks)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        parsed = json.loads(content)

        # Update resume with parsed data
        resume.full_name = parsed.get("full_name", resume.full_name)
        resume.email = parsed.get("email", resume.email)
        resume.phone = parsed.get("phone", resume.phone)
        resume.location = parsed.get("location", resume.location)
        resume.summary = parsed.get("summary", resume.summary)
        resume.skills = parsed.get("skills", resume.skills)
        resume.experience = parsed.get("experience", resume.experience)
        resume.education = parsed.get("education", resume.education)
        resume.certifications = parsed.get("certifications", resume.certifications)

        db.commit()
        return json.dumps({"status": "parsed", "id": resume.id, "data": parsed})

    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Failed to parse LLM response as JSON: {str(e)}"})
    except Exception as e:
        logger.error(f"Resume parsing error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def optimize_resume_for_job(resume_id: int, job_id: int) -> str:
    """Tailor resume experience bullets to match a specific job description.
    Rewrites achievements using keywords and requirements from the JD."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()

        if not resume:
            return json.dumps({"error": "Resume not found"})
        if not job:
            return json.dumps({"error": "Job not found"})

        llm = get_llm()
        prompt = f"""You are an expert resume optimizer. Rewrite the resume experience bullets to better match the target job description.

Rules:
- Keep the same companies and roles (don't fabricate)
- Use strong action verbs
- Incorporate relevant keywords from the JD
- Quantify achievements where possible
- Focus on transferable skills that match the JD

JOB DESCRIPTION:
Title: {job.job_title} at {job.company}
{job.description[:3000]}

CURRENT RESUME EXPERIENCE:
{json.dumps(resume.experience, indent=2)[:3000]}

CURRENT SKILLS:
{json.dumps(resume.skills)}

Return ONLY valid JSON with the optimized experience array in the same format:
[{{"company": "...", "title": "...", "start_date": "...", "end_date": "...", "bullets": ["...", "..."]}}]"""

        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        optimized = json.loads(content)
        return json.dumps({
            "status": "optimized",
            "original_experience": resume.experience,
            "optimized_experience": optimized,
            "job_title": job.job_title,
            "company": job.company,
        })

    except Exception as e:
        logger.error(f"Resume optimization error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


@tool
def calculate_ats_score(resume_id: int, job_id: int) -> str:
    """Calculate an ATS (Applicant Tracking System) keyword match score.
    Compares resume content against job description requirements."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        job = db.query(JobDescription).filter(JobDescription.id == job_id).first()

        if not resume:
            return json.dumps({"error": "Resume not found"})
        if not job:
            return json.dumps({"error": "Job not found"})

        llm = get_llm()
        prompt = f"""Analyze this resume against the job description for ATS compatibility.

JOB DESCRIPTION:
Title: {job.job_title} at {job.company}
{job.description[:3000]}

RESUME:
Name: {resume.full_name}
Summary: {resume.summary}
Skills: {json.dumps(resume.skills)}
Experience: {json.dumps(resume.experience)[:2000]}

Return ONLY valid JSON:
{{
  "ats_score": <0-100 integer>,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["suggestion1", "suggestion2"],
  "summary": "brief assessment"
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
        logger.error(f"ATS scoring error: {e}")
        return json.dumps({"error": str(e)})
    finally:
        db.close()


# Export all resume AI tools
resume_ai_tools = [parse_resume_text, optimize_resume_for_job, calculate_ats_score]
