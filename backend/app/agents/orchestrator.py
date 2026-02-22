"""
LangGraph orchestrator - the brain of CareerOS.

Routes user messages to specialized agents:
- ResumeAgent: resume parsing, editing, optimization
- InterviewAgent: mock interviews, question generation
- FeedbackAgent: answer evaluation, scoring
- JobAgent: job description analysis, skill matching
- GeneralAgent: cover letters, LinkedIn messages, general chat

Uses a supervisor pattern where a router decides which agent handles each message.
"""

import logging
from typing import Annotated, TypedDict, Literal
from datetime import datetime, timezone

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from .tools import resume_tools, job_tools, interview_tools, all_tools
from .resume_tools import resume_ai_tools
from .job_tools import job_ai_tools
from .interview_tools import interview_ai_tools
from ..services.llm_provider import get_llm

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_agent: str
    session_id: str


ROUTER_SYSTEM = """You are the CareerOS router. Analyze the user's message and decide which specialist agent should handle it.

Available agents:
- "resume": Resume creation, editing, parsing, optimization, formatting
- "interview": Mock interview practice, interview questions, interview prep
- "feedback": Evaluating interview answers, scoring, improvement suggestions
- "job": Job description analysis, skill gap analysis, job tracking, application status
- "general": Cover letters, LinkedIn messages, career advice, general questions

Respond with ONLY the agent name (one word). If unsure, respond with "general"."""

RESUME_SYSTEM = """You are the Resume Specialist agent for CareerOS. You help with:
- Parsing and extracting information from uploaded resumes
- Writing and improving resume sections (summary, experience bullets, skills)
- Tailoring resumes for specific job descriptions
- Formatting and structure advice

You have access to tools for searching and saving resumes in the local database.
Be specific and actionable. When writing resume content, use strong action verbs and quantify achievements.
Always maintain a professional tone."""

INTERVIEW_SYSTEM = """You are Hannah, the Mock Interview Agent for CareerOS. You conduct realistic mock interviews.

Your approach:
1. If no job description is selected, ask the user to provide one or select from saved jobs
2. Start with introductions and set expectations
3. Ask ONE question at a time - mix behavioral and technical based on the role
4. Wait for the user's answer before proceeding
5. After each answer, briefly acknowledge it before moving to the next question
6. After 5-8 questions, wrap up and provide overall feedback

You have access to job descriptions and interview history in the database.
Be encouraging but honest. Make the interview feel realistic."""

FEEDBACK_SYSTEM = """You are the Interview Feedback Agent for CareerOS. You evaluate interview answers.

For each answer, assess:
- Relevance: Does it address the question?
- Structure: Is it well-organized (e.g., STAR method)?
- Specificity: Are there concrete examples and metrics?
- Communication: Is it clear and concise?

Provide a score (1-10) and specific, actionable improvement suggestions.
Be constructive - highlight what was good before suggesting improvements."""

JOB_SYSTEM = """You are the Job Analysis Agent for CareerOS. You help with:
- Extracting key requirements from job descriptions
- Identifying required vs nice-to-have skills
- Comparing job requirements against the user's resume/skills
- Tracking application status
- Suggesting improvements to increase match rate

You have access to job descriptions and resumes in the local database.
Be analytical and data-driven in your assessments."""

GENERAL_SYSTEM = """You are the Career Assistant for CareerOS. You help with:
- Writing cover letters tailored to job descriptions
- Crafting LinkedIn connection messages
- General career advice and job search strategy
- Any career-related questions

Be professional, personable, and practical in your advice."""


def create_agent_graph() -> StateGraph:
    """Create the LangGraph agent orchestrator."""

    llm = get_llm()

    # Bind tools to LLM for agents that need them
    # Each agent gets both CRUD tools and AI-powered tools
    resume_llm = llm.bind_tools(resume_tools + resume_ai_tools)
    interview_llm = llm.bind_tools(interview_tools + interview_ai_tools)
    job_llm = llm.bind_tools(job_tools + job_ai_tools)
    feedback_llm = llm.bind_tools(interview_ai_tools)

    def router(state: AgentState) -> AgentState:
        """Route the message to the appropriate agent."""
        messages = state["messages"]
        current = state.get("current_agent", "")

        # If we're in an active interview, stay with interview agent
        if current == "interview" and len(messages) > 2:
            last_human = None
            for m in reversed(messages):
                if isinstance(m, HumanMessage):
                    last_human = m.content.lower()
                    break
            if last_human and not any(kw in last_human for kw in ["stop", "end interview", "quit", "exit"]):
                return {**state, "current_agent": "interview"}

        # Use LLM to route
        route_messages = [
            SystemMessage(content=ROUTER_SYSTEM),
            messages[-1] if messages else HumanMessage(content="hello"),
        ]

        try:
            response = llm.invoke(route_messages)
            agent = response.content.strip().lower().replace('"', '').replace("'", "")
            if agent not in ("resume", "interview", "feedback", "job", "general"):
                agent = "general"
        except Exception as e:
            logger.warning(f"Router failed, defaulting to general: {e}")
            agent = "general"

        return {**state, "current_agent": agent}

    def resume_agent(state: AgentState) -> AgentState:
        messages = [SystemMessage(content=RESUME_SYSTEM)] + state["messages"]
        response = resume_llm.invoke(messages)
        return {**state, "messages": [response]}

    def interview_agent(state: AgentState) -> AgentState:
        messages = [SystemMessage(content=INTERVIEW_SYSTEM)] + state["messages"]
        response = interview_llm.invoke(messages)
        return {**state, "messages": [response]}

    def feedback_agent(state: AgentState) -> AgentState:
        messages = [SystemMessage(content=FEEDBACK_SYSTEM)] + state["messages"]
        response = feedback_llm.invoke(messages)
        return {**state, "messages": [response]}

    def job_agent(state: AgentState) -> AgentState:
        messages = [SystemMessage(content=JOB_SYSTEM)] + state["messages"]
        response = job_llm.invoke(messages)
        return {**state, "messages": [response]}

    def general_agent(state: AgentState) -> AgentState:
        messages = [SystemMessage(content=GENERAL_SYSTEM)] + state["messages"]
        response = llm.invoke(messages)
        return {**state, "messages": [response]}

    def route_to_agent(state: AgentState) -> str:
        """Conditional edge: route to the selected agent."""
        return state.get("current_agent", "general")

    def should_use_tools(state: AgentState) -> str:
        """Check if the last message has tool calls."""
        messages = state["messages"]
        if messages and hasattr(messages[-1], "tool_calls") and messages[-1].tool_calls:
            return "tools"
        return END

    # Build the graph — combine CRUD tools with AI tools
    all_combined_tools = all_tools + resume_ai_tools + job_ai_tools + interview_ai_tools
    tool_node = ToolNode(all_combined_tools)

    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("router", router)
    graph.add_node("resume", resume_agent)
    graph.add_node("interview", interview_agent)
    graph.add_node("feedback", feedback_agent)
    graph.add_node("job", job_agent)
    graph.add_node("general", general_agent)
    graph.add_node("tools", tool_node)

    # Set entry point
    graph.set_entry_point("router")

    # Router → agent
    graph.add_conditional_edges("router", route_to_agent, {
        "resume": "resume",
        "interview": "interview",
        "feedback": "feedback",
        "job": "job",
        "general": "general",
    })

    # Each agent → check for tool calls → END or tools
    for agent_name in ["resume", "interview", "feedback", "job", "general"]:
        graph.add_conditional_edges(agent_name, should_use_tools, {
            "tools": "tools",
            END: END,
        })

    # Tools → route back to the same agent
    graph.add_conditional_edges("tools", route_to_agent, {
        "resume": "resume",
        "interview": "interview",
        "feedback": "feedback",
        "job": "job",
        "general": "general",
    })

    return graph.compile()


# Lazy singleton
_compiled_graph = None


def get_agent_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = create_agent_graph()
    return _compiled_graph
