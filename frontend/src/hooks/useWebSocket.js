import { useState, useRef, useCallback, useEffect } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

/**
 * WebSocket hook for real-time chat with the backend agent.
 * Handles connection, reconnection, and PersonaPlex capabilities.
 */
export function useWebSocket(sessionId = "general") {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [avatarState, setAvatarState] = useState("idle");
  const [capabilities, setCapabilities] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/api/chat/ws/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "capabilities":
            setCapabilities(data.data);
            break;
          case "message":
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: data.content,
                agent: data.agent,
                timestamp: new Date().toISOString(),
              },
            ]);
            setAvatarState("idle");
            break;
          case "avatar_state":
            setAvatarState(data.state);
            break;
          case "audio_ack":
            break;
          default:
            break;
        }
      } catch {
        // Non-JSON message
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3s
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [sessionId]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((content) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: "text", content }));
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const sendAudio = useCallback((audioData) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "audio", data: audioData }));
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    connected,
    messages,
    setMessages,
    avatarState,
    capabilities,
    connect,
    disconnect,
    sendMessage,
    sendAudio,
  };
}
