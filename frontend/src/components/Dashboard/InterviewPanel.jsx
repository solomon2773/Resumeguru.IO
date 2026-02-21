import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Play, Square, Bot, User } from "lucide-react";
import { clsx } from "clsx";
import { useWebSocket } from "../../hooks/useWebSocket";
import { usePersonaPlex } from "../../hooks/usePersonaPlex";
import AvatarWidget from "../PersonaPlex/AvatarWidget";

export default function InterviewPanel() {
  const [input, setInput] = useState("");
  const [interviewActive, setInterviewActive] = useState(false);
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
  } = useWebSocket("interview");

  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    speak,
    useBrowserSpeech,
  } = usePersonaPlex(capabilities);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  // Auto-speak assistant messages during interview
  useEffect(() => {
    if (!interviewActive || !messages.length) return;
    const last = messages[messages.length - 1];
    if (last.role === "assistant" && useBrowserSpeech) {
      speak(last.content);
    }
  }, [messages, interviewActive, speak, useBrowserSpeech]);

  const startInterview = () => {
    setInterviewActive(true);
    setMessages([]);
    sendMessage(
      "Start a mock interview. Ask me one question at a time. Begin with a behavioral question."
    );
  };

  const endInterview = () => {
    sendMessage(
      "End the interview and provide overall feedback with a score out of 10."
    );
    setInterviewActive(false);
  };

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

  return (
    <div className="flex h-full">
      {/* Interview Chat */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mock Interview</h2>
            <p className="text-sm text-gray-500">
              {interviewActive ? "Interview in progress..." : "Practice with AI interviewer Hannah"}
            </p>
          </div>
          {!interviewActive ? (
            <button onClick={startInterview} disabled={!connected} className="btn-primary">
              <Play size={16} /> Start Interview
            </button>
          ) : (
            <button onClick={endInterview} className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100">
              <span className="flex items-center gap-2"><Square size={14} /> End Interview</span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!interviewActive && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <Mic size={48} strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-sm font-medium">Ready for your mock interview?</p>
                <p className="text-xs mt-1">Hannah will ask behavioral and technical questions.</p>
                <p className="text-xs mt-1">Use voice or text to answer.</p>
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
                <div className={clsx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100",
                  avatarState === "speaking" && i === messages.length - 1 && "avatar-speaking"
                )}>
                  <Bot size={18} className="text-brand-600" />
                </div>
              )}
              <div className={clsx(
                "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-800"
              )}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <User size={18} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {avatarState === "thinking" && (
            <div className="animate-fade-in-up flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
                <Bot size={18} className="text-brand-600" />
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
        {interviewActive && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex items-end gap-3">
              <button
                onClick={isListening ? stopListening : startListening}
                className={clsx(
                  "rounded-lg p-3 transition",
                  isListening
                    ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer or use the mic..."
                rows={2}
                className="input flex-1 resize-none"
              />
              <button onClick={handleSend} disabled={!input.trim()} className="btn-primary">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-72 border-l border-gray-100 p-4 flex flex-col items-center">
        <AvatarWidget state={avatarState} capabilities={capabilities} large />
      </div>
    </div>
  );
}
