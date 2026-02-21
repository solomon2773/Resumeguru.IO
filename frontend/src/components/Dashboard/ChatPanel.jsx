import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Trash2, Bot, User } from "lucide-react";
import { clsx } from "clsx";
import { useWebSocket } from "../../hooks/useWebSocket";
import { usePersonaPlex } from "../../hooks/usePersonaPlex";
import AvatarWidget from "../PersonaPlex/AvatarWidget";

const agentColors = {
  resume: "text-purple-600",
  interview: "text-brand-600",
  feedback: "text-amber-600",
  job: "text-green-600",
  general: "text-gray-600",
};

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [sessionId] = useState("general");
  const messagesEndRef = useRef(null);

  const {
    connected,
    messages,
    setMessages,
    avatarState,
    capabilities,
    connect,
    disconnect,
    sendMessage,
  } = useWebSocket(sessionId);

  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    speak,
    useBrowserSpeech,
  } = usePersonaPlex(capabilities);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-500">
              {connected ? "Connected" : "Connecting..."} &middot; Ask anything about your career
            </p>
          </div>
          <button onClick={handleClear} className="btn-secondary text-xs" title="Clear chat">
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
              <Bot size={48} strokeWidth={1.5} />
              <p className="text-sm">Hi! I'm your AI career assistant. Ask me anything.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {[
                  "Help me improve my resume",
                  "Start a mock interview",
                  "Analyze this job description",
                  "Write a cover letter",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); }}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                "animate-fade-in-up flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <Bot size={16} className="text-brand-600" />
                </div>
              )}
              <div
                className={clsx(
                  "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {msg.content}
                {msg.agent && (
                  <p className={clsx("mt-1 text-xs opacity-60", agentColors[msg.agent])}>
                    {msg.agent} agent
                  </p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {avatarState === "thinking" && (
            <div className="animate-fade-in-up flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
                <Bot size={16} className="text-brand-600" />
              </div>
              <div className="rounded-2xl bg-gray-100 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-end gap-3">
            <button
              onClick={isListening ? stopListening : startListening}
              className={clsx(
                "rounded-lg p-2.5 transition",
                isListening
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or use voice..."
              rows={1}
              className="input flex-1 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !connected}
              className="btn-primary"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Sidebar - only show when PersonaPlex available */}
      {capabilities?.avatar_available && (
        <div className="w-72 border-l border-gray-100 p-4">
          <AvatarWidget state={avatarState} capabilities={capabilities} />
        </div>
      )}
    </div>
  );
}
