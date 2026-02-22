"""
SSE (Server-Sent Events) streaming endpoint for real-time AI responses.

Streams agent responses token-by-token for a modern AI chat UX.
Falls back to the regular REST endpoint if streaming isn't supported.
"""

import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, AIMessage

from ..agents.orchestrator import get_agent_graph, AgentState
from ..database import SessionLocal, ChatMessage as ChatMessageDB
from ..schemas import ChatMessage

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

# Share session state with the main chat router
_session_states: dict = {}


def _get_or_create_session(session_id: str) -> dict:
    if session_id not in _session_states:
        _session_states[session_id] = {
            "messages": [],
            "current_agent": "",
            "session_id": session_id,
        }
    return _session_states[session_id]


async def _stream_response(content: str, agent: str, session_id: str):
    """Stream response as SSE events, yielding word-by-word for smooth display."""
    # Send agent info first
    yield f"data: {json.dumps({'type': 'agent', 'agent': agent})}\n\n"

    # Stream content in chunks (word-by-word for natural feel)
    words = content.split(" ")
    buffer = ""
    for i, word in enumerate(words):
        buffer += word + (" " if i < len(words) - 1 else "")
        # Yield every few words for smooth streaming
        if len(buffer) >= 15 or i == len(words) - 1:
            yield f"data: {json.dumps({'type': 'token', 'content': buffer})}\n\n"
            buffer = ""

    # Send completion event
    yield f"data: {json.dumps({'type': 'done', 'agent': agent, 'session_id': session_id})}\n\n"


@router.post("/stream")
async def stream_message(msg: ChatMessage):
    """Send a message to the AI agent and stream the response via SSE."""
    graph = get_agent_graph()
    state = _get_or_create_session(msg.session_id)

    # Add user message
    state["messages"].append(HumanMessage(content=msg.content))

    # Log user message to database
    db = SessionLocal()
    try:
        db.add(ChatMessageDB(
            session_id=msg.session_id,
            role="user",
            content=msg.content,
        ))
        db.commit()
    finally:
        db.close()

    # Run agent graph (non-streaming internally, we simulate streaming of the result)
    try:
        result = graph.invoke(state)

        ai_messages = [m for m in result["messages"] if isinstance(m, AIMessage)]
        response_content = ai_messages[-1].content if ai_messages else "I'm not sure how to help with that."
        agent_used = result.get("current_agent", "general")

        # Update session state
        state["messages"] = result["messages"]
        state["current_agent"] = agent_used

        # Log response to database
        db = SessionLocal()
        try:
            db.add(ChatMessageDB(
                session_id=msg.session_id,
                role="assistant",
                content=response_content,
                metadata={"agent": agent_used},
            ))
            db.commit()
        finally:
            db.close()

        return StreamingResponse(
            _stream_response(response_content, agent_used, msg.session_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    except Exception as e:
        logger.error(f"Stream error: {e}")

        async def error_stream():
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

        return StreamingResponse(
            error_stream(),
            media_type="text/event-stream",
        )
