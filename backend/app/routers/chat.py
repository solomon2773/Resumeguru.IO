"""
Chat router - handles WebSocket and REST chat with the LangGraph agent.
"""

import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage

from ..agents.orchestrator import get_agent_graph
from ..database import get_db, ChatMessage as ChatMessageDB, SessionLocal
from ..schemas import ChatMessage, ChatResponse
from ..services.personaplex import personaplex_service, AvatarState

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

# In-memory session state for the single user
_session_states: dict = {}


def _get_or_create_session(session_id: str) -> dict:
    if session_id not in _session_states:
        _session_states[session_id] = {
            "messages": [],
            "current_agent": "",
            "session_id": session_id,
        }
    return _session_states[session_id]


@router.post("/message", response_model=ChatResponse)
async def send_message(msg: ChatMessage):
    """Send a message to the AI agent and get a response."""
    graph = get_agent_graph()
    state = _get_or_create_session(msg.session_id)

    # Add user message
    state["messages"].append(HumanMessage(content=msg.content))

    # Log to database
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

    # Run agent graph
    result = graph.invoke(state)

    # Extract AI response
    ai_messages = [m for m in result["messages"] if isinstance(m, AIMessage)]
    response_content = ai_messages[-1].content if ai_messages else "I'm not sure how to help with that."
    agent_used = result.get("current_agent", "general")

    # Update session state
    state["messages"] = result["messages"]
    state["current_agent"] = agent_used

    # Log response
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

    return ChatResponse(
        content=response_content,
        agent=agent_used,
        session_id=msg.session_id,
    )


@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time chat with the AI agent.
    Supports text messages and audio streaming (PersonaPlex).
    """
    await websocket.accept()
    graph = get_agent_graph()
    state = _get_or_create_session(session_id)

    # Send PersonaPlex capabilities on connect
    capabilities = await personaplex_service.initialize()
    await websocket.send_json({
        "type": "capabilities",
        "data": capabilities,
    })

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            msg_type = data.get("type", "text")

            if msg_type == "text":
                content = data.get("content", "")
                if not content:
                    continue

                # Add to state
                state["messages"].append(HumanMessage(content=content))

                # Update avatar to thinking
                await personaplex_service.set_avatar_state(AvatarState.THINKING)
                await websocket.send_json({"type": "avatar_state", "state": "thinking"})

                # Run agent
                result = graph.invoke(state)

                ai_messages = [m for m in result["messages"] if isinstance(m, AIMessage)]
                response_content = ai_messages[-1].content if ai_messages else "I'm not sure how to help."
                agent_used = result.get("current_agent", "general")

                state["messages"] = result["messages"]
                state["current_agent"] = agent_used

                # Send response
                await websocket.send_json({
                    "type": "message",
                    "content": response_content,
                    "agent": agent_used,
                })

                # Update avatar to speaking then idle
                await personaplex_service.set_avatar_state(AvatarState.SPEAKING)
                await websocket.send_json({"type": "avatar_state", "state": "speaking"})

                # Log to DB
                db = SessionLocal()
                try:
                    db.add(ChatMessageDB(session_id=session_id, role="user", content=content))
                    db.add(ChatMessageDB(session_id=session_id, role="assistant", content=response_content, metadata={"agent": agent_used}))
                    db.commit()
                finally:
                    db.close()

            elif msg_type == "audio":
                # Audio data for PersonaPlex ASR
                await personaplex_service.set_avatar_state(AvatarState.LISTENING)
                await websocket.send_json({"type": "avatar_state", "state": "listening"})
                # Audio processing handled via PersonaPlex service
                # For now, acknowledge receipt
                await websocket.send_json({"type": "audio_ack"})

            elif msg_type == "end":
                break

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await personaplex_service.set_avatar_state(AvatarState.IDLE)


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session."""
    db = SessionLocal()
    try:
        messages = db.query(ChatMessageDB).filter(
            ChatMessageDB.session_id == session_id
        ).order_by(ChatMessageDB.created_at).all()
        return [{
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "metadata": m.metadata,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        } for m in messages]
    finally:
        db.close()


@router.delete("/history/{session_id}")
async def clear_chat_history(session_id: str):
    """Clear chat history and reset session."""
    db = SessionLocal()
    try:
        db.query(ChatMessageDB).filter(ChatMessageDB.session_id == session_id).delete()
        db.commit()
    finally:
        db.close()

    if session_id in _session_states:
        del _session_states[session_id]

    return {"status": "cleared"}
