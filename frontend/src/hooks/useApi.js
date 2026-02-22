/**
 * API hook for communicating with the CareerOS backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  // System
  getStatus: () => request("/api/status"),
  health: () => request("/health"),

  // Chat
  sendMessage: (content, sessionId = "general") =>
    request("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({ content, session_id: sessionId }),
    }),
  /**
   * Stream a chat response via SSE. Calls onToken for each chunk, onDone when complete.
   * Returns an abort controller to cancel the stream.
   */
  streamMessage: (content, sessionId = "general", { onToken, onAgent, onDone, onError } = {}) => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, session_id: sessionId }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Stream request failed");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "token" && onToken) onToken(data.content);
              else if (data.type === "agent" && onAgent) onAgent(data.agent);
              else if (data.type === "done" && onDone) onDone(data);
              else if (data.type === "error" && onError) onError(data.content);
            } catch {}
          }
        }
        if (onDone) onDone({});
      })
      .catch((err) => {
        if (err.name !== "AbortError" && onError) onError(err.message);
      });
    return controller;
  },
  getChatHistory: (sessionId) => request(`/api/chat/history/${sessionId}`),
  clearChat: (sessionId) =>
    request(`/api/chat/history/${sessionId}`, { method: "DELETE" }),

  // Resumes
  getResumes: () => request("/api/resumes/"),
  getResume: (id) => request(`/api/resumes/${id}`),
  createResume: (data) =>
    request("/api/resumes/", { method: "POST", body: JSON.stringify(data) }),
  updateResume: (id, data) =>
    request(`/api/resumes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteResume: (id) =>
    request(`/api/resumes/${id}`, { method: "DELETE" }),
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/resumes/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  // Jobs
  getJobs: (status) =>
    request(`/api/jobs/${status ? `?status=${status}` : ""}`),
  getJob: (id) => request(`/api/jobs/${id}`),
  createJob: (data) =>
    request("/api/jobs/", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id, data) =>
    request(`/api/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/api/jobs/${id}`, { method: "DELETE" }),
  getJobStats: () => request("/api/jobs/stats/summary"),

  // Interviews
  getInterviews: () => request("/api/interviews/"),
  getInterview: (id) => request(`/api/interviews/${id}`),
  deleteInterview: (id) =>
    request(`/api/interviews/${id}`, { method: "DELETE" }),
  getInterviewStats: () => request("/api/interviews/stats/summary"),
};
