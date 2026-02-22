# CareerOS: The Proactive Career Agent

## Strategic Purpose

This is not just a resume tool — it's a **living portfolio** designed to demonstrate mastery of the NVIDIA Inference Microservices (NIM) ecosystem, open-source inference integration, and Day-0 model support. Every architectural decision maps to a specific NVIDIA job requirement.

---

## Table of Contents

1. [The "Hybrid-Inference" Architecture](#1-the-hybrid-inference-architecture)
2. [Current Implementation Status](#2-current-implementation-status)
3. [Technical Stack & NVIDIA Alignment](#3-technical-stack--nvidia-alignment)
4. [System Architecture](#4-system-architecture)
5. [Backend: Python Agent System](#5-backend-python-agent-system)
6. [Agent Modules & LangGraph Workflows](#6-agent-modules--langgraph-workflows)
7. [Frontend: Next.js Dashboard](#7-frontend-nextjs-dashboard)
8. [Infrastructure & Docker Compose](#8-infrastructure--docker-compose)
9. [Feature Specifications](#9-feature-specifications)
10. [Implementation Roadmap (6-Week Sprints)](#10-implementation-roadmap-6-week-sprints)
11. [Hardware Requirements](#11-hardware-requirements)
12. [NVIDIA Job Alignment Map](#12-nvidia-job-alignment-map)
13. [Risk Analysis & Mitigations](#13-risk-analysis--mitigations)

---

## 1. The "Hybrid-Inference" Architecture

The core differentiator: CareerOS **detects hardware at startup** and automatically selects the optimal inference path. This proves you understand developer workflows and hardware constraints.

### Mode A: "Student / Mac" Mode (Cloud-Native NIM)

- **Target**: MacBook Pro (M2/M3/M4/M5) or any laptop without NVIDIA GPU
- **Constraint**: No CUDA containers possible
- **Solution**: Local Docker runs the logic (LangGraph + FastAPI), offloads LLM inference to NVIDIA NIM Cloud APIs via `langchain-nvidia-ai-endpoints`, or falls back to local `llama.cpp` with Metal acceleration
- **JD Value**: Shows you know how to integrate NVIDIA's remote APIs into a lightweight client

### Mode B: "Enterprise / DGX" Mode (Local NIM)

- **Target**: NVIDIA DGX Spark GB10, Linux workstations with RTX GPUs
- **Solution**: System detects NVIDIA hardware via `nvidia-smi`, auto-configures to use Local NIM containers (e.g., `nvcr.io/nim/meta/llama-3.1-70b-instruct`)
- **JD Value**: Demonstrates deploying and orchestrating self-hosted NVIDIA microservices

### How It Works (Already Implemented)

```
Startup → gpu_detect.py → nvidia-smi found?
  ├─ YES → DGX Spark / NVIDIA GPU detected
  │         ├─ VRAM ≥ 40GB → llama-3.1-70b-instruct (NIM)
  │         ├─ VRAM ≥ 8GB  → llama-3.1-8b-instruct (NIM)
  │         └─ VRAM < 8GB  → local llama.cpp
  │
  └─ NO → Apple Silicon? (sysctl machdep.cpu.brand_string)
           ├─ YES → llama.cpp with Metal GPU offload
           └─ NO  → llama.cpp CPU-only or OpenAI API fallback
```

**Implementation**: `backend/app/services/gpu_detect.py` + `backend/app/services/llm_provider.py`

---

## 2. Current Implementation Status

### What's Built and Working

| Component | Status | File(s) |
|-----------|--------|---------|
| GPU auto-detection (DGX/NVIDIA/Apple/CPU) | **100%** | `backend/app/services/gpu_detect.py` |
| LLM fallback chain (NIM → llama.cpp → OpenAI) | **85%** | `backend/app/services/llm_provider.py` |
| LangGraph supervisor + 5 agents | **70%** | `backend/app/agents/orchestrator.py` |
| Database tools (7 CRUD tools) | **40%** | `backend/app/agents/tools.py` |
| PersonaPlex service stubs (health checks, TTS/ASR stubs) | **50%** | `backend/app/services/personaplex.py` |
| FastAPI server with CORS, static files, lifespan | **100%** | `backend/app/main.py` |
| Pydantic config with .env support | **100%** | `backend/app/config.py` |
| SQLite database (6 tables) | **100%** | `backend/app/database.py` |
| Pydantic schemas (request/response validation) | **100%** | `backend/app/schemas.py` |
| Chat router (WebSocket + REST) | **90%** | `backend/app/routers/chat.py` |
| Resume router (CRUD + file upload + text extraction) | **100%** | `backend/app/routers/resume.py` |
| Jobs router (CRUD + stats + pipeline) | **100%** | `backend/app/routers/jobs.py` |
| Interview router (CRUD + stats) | **100%** | `backend/app/routers/interview.py` |
| Frontend: Dashboard with 6 panels | **95%** | `frontend/src/components/Dashboard/` |
| Frontend: AvatarWidget (visual states) | **60%** | `frontend/src/components/PersonaPlex/AvatarWidget.jsx` |
| Frontend: REST API client | **100%** | `frontend/src/hooks/useApi.js` |
| Frontend: WebSocket hook | **100%** | `frontend/src/hooks/useWebSocket.js` |
| Frontend: Browser Speech fallback | **80%** | `frontend/src/hooks/usePersonaPlex.js` |
| Dockerfiles (frontend + backend) | **100%** | `backend/Dockerfile`, `frontend/Dockerfile` |

### What's NOT Built Yet (Priority Order for NVIDIA Portfolio)

| Feature | Priority | JD Alignment |
|---------|----------|--------------|
| docker-compose with NIM stack | **P0** | Demonstrates NIM orchestration |
| Agent intelligence (JD extraction, skill gap, resume optimization tools) | **P0** | Complex agent logic, not just API calls |
| SSE streaming for chat responses | **P1** | Modern AI UX |
| Riva STT/TTS working integration | **P1** | NIM speech services |
| VILA Vision integration | **P1** | NIM multimodal |
| Qdrant + NV-Embed vector search | **P1** | NIM embeddings |
| Piston code execution sandbox | **P2** | Skill-Check feature |
| Market Watcher proactive agent | **P2** | Autonomous agent design |
| Monaco Editor for coding interviews | **P2** | Rich interview UX |
| Application Bot (auto-apply) | **P3** | Browser automation |
| AnalyticsPanel real charts | **P3** | Dashboard polish |

---

## 3. Technical Stack & NVIDIA Alignment

| Component | Technology | NVIDIA Integration |
|-----------|-----------|-------------------|
| **Agent Orchestrator** | LangGraph (Python) | Stateful cyclic supervisor graph — shows complex agent design, not just linear chains |
| **LLM Inference** | Llama 3.1 (8B/70B) | Accessed via `ChatNVIDIA` from `langchain-nvidia-ai-endpoints` |
| **Vision (Multimodal)** | NVIDIA VILA / LLaVA | NIM container for visual interview coaching |
| **Speech (STT/TTS)** | NVIDIA Riva | Real-time Mock Interview voice mode |
| **Embeddings** | NV-Embed-v1 | `NVIDIAEmbeddings` for semantic resume↔JD matching |
| **Vector Search** | Qdrant (Local Docker) | Stores resume + JD embeddings for gap analysis |
| **Code Sandbox** | Piston | Dockerized code execution for Skill-Check interviews |
| **Database** | SQLite (SQLAlchemy) | Zero-config local-first, single-user design |
| **Frontend** | Next.js 14 + Tailwind CSS | Single-page dashboard with WebSocket real-time chat |
| **Backend** | FastAPI + Uvicorn | WebSocket + REST API, async-native |

---

## 4. System Architecture

```
+------------------+     +------------------+     +-------------------+
|   User Device    |     |  Next.js 14      |     |  FastAPI + LangGraph
|  (Mac/PC/DGX)   |---->|  Dashboard UI    |---->|  Agent Orchestrator
|                  |     |  Port 3000       |     |  Port 8000        |
+------------------+     +------------------+     +--------+----------+
                                                           |
                         +---------------------------------+----------------------------------+
                         |                |                |                |                  |
              +----------v---------+  +--v--------+  +---v---------+  +--v---------+  +-----v-------+
              | Supervisor Router  |  | Resume    |  | Interview   |  | Job        |  | General     |
              | (Intent Classify)  |  | Agent     |  | Agent       |  | Agent      |  | Agent       |
              +--------------------+  +-----------+  +-------------+  +------------+  +-------------+
                         |                                |                |
              +----------v---------+           +---------v--------+  +---v-----------+
              | LangChain Tools    |           | PersonaPlex      |  | Vector Store  |
              | (DB CRUD, Parse,   |           | - Riva STT/TTS   |  | - Qdrant      |
              |  Analyze, Score)   |           | - Audio2Face     |  | - NV-Embed-v1 |
              +--------------------+           +------------------+  +---------------+
                         |
              +----------v---------+
              | LLM Provider       |
              | NIM → llama.cpp    |
              |   → OpenAI API     |
              +--------------------+
```

---

## 5. Backend: Python Agent System

### Directory Structure (Current)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app, lifespan, CORS, router registration
│   ├── config.py                  # Pydantic settings + ComputeBackend enum
│   ├── database.py                # SQLAlchemy: Resume, JobDescription, InterviewSession,
│   │                              #   ChatMessage, CoverLetter, AppSetting
│   ├── schemas.py                 # Pydantic request/response models
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py        # LangGraph supervisor graph (5 agent nodes + router)
│   │   └── tools.py               # LangChain tools (search_resumes, save_job, etc.)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gpu_detect.py          # NVIDIA/Apple/CPU auto-detection
│   │   ├── llm_provider.py        # NIM → llama.cpp → OpenAI fallback chain
│   │   └── personaplex.py         # Riva STT/TTS + Audio2Face health checks + stubs
│   │
│   └── routers/
│       ├── __init__.py
│       ├── chat.py                # WebSocket + REST chat with agent graph
│       ├── resume.py              # Resume CRUD + file upload (PDF/DOCX/DOC/TXT)
│       ├── jobs.py                # Job tracking with pipeline stats
│       └── interview.py           # Interview session CRUD + stats
│
├── data/                          # SQLite DB + uploads (gitignored)
├── models/                        # Local .gguf models (gitignored)
├── requirements.txt
├── Dockerfile
└── .env.example
```

### Target Directory Structure (Adding)

```
backend/app/
├── ...existing...
├── agents/
│   ├── orchestrator.py            # (existing) Supervisor + router
│   ├── tools.py                   # (existing → enhance) Add AI-powered tools
│   ├── resume_tools.py            # NEW: AI resume parsing, optimization, ATS scoring
│   ├── interview_tools.py         # NEW: Question generation, answer evaluation
│   └── job_tools.py               # NEW: JD extraction, skill gap analysis
│
├── services/
│   ├── ...existing...
│   ├── vector_store.py            # NEW: Qdrant + NV-Embed integration
│   └── code_sandbox.py            # NEW: Piston integration for Skill-Check
│
└── routers/
    ├── ...existing...
    └── stream.py                  # NEW: SSE streaming endpoint
```

### Requirements (Current)

```
# Core
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
python-multipart>=0.0.12
websockets>=13.0

# LangChain + LangGraph
langchain>=0.3.0
langchain-core>=0.3.0
langchain-community>=0.3.0
langgraph>=0.2.0
langchain-nvidia-ai-endpoints>=0.3.0

# Local LLM (Apple Silicon / CPU)
llama-cpp-python>=0.3.0

# Database
sqlalchemy>=2.0.0
aiosqlite>=0.20.0

# NVIDIA Speech
nvidia-riva-client>=2.17.0

# GPU detection
psutil>=6.0.0
py3nvml>=0.2.7

# Pydantic
pydantic>=2.9.0
pydantic-settings>=2.6.0

# Document processing
python-docx>=1.1.0
pypdf>=4.0.0

# HTTP
httpx>=0.27.0
aiohttp>=3.10.0

# Utilities
python-dotenv>=1.0.0
python-dateutil>=2.9.0
```

### Requirements to Add (for remaining features)

```
# Vector search
langchain-qdrant>=0.2.0
qdrant-client>=1.12.0

# Background tasks (Market Watcher)
apscheduler>=3.10.0          # Simpler than Celery for single-user

# Code execution
httpx>=0.27.0                # (already included) for Piston API calls
```

---

## 6. Agent Modules & LangGraph Workflows

### 6A. Supervisor Router (Implemented)

The supervisor uses LLM-based intent classification to route messages to the correct specialist agent. Each agent has tool bindings for database operations.

```python
# backend/app/agents/orchestrator.py (current implementation)

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_agent: str          # "resume" | "interview" | "feedback" | "job" | "general"
    session_id: str

# Router → classifies intent → routes to agent
# Agent → invokes LLM with system prompt + tools → checks for tool calls
# Tool calls → execute tools → return to same agent
# No tool calls → END
```

**Current agents**:
- **Router**: LLM-based intent classification (5 categories)
- **Resume Agent**: Resume CRUD with search_resumes, get_resume_detail, save_resume tools
- **Interview Agent**: "Hannah" persona, mock interviews with interview history tools
- **Feedback Agent**: Answer evaluation and scoring (text-only, no tools yet)
- **Job Agent**: Job tracking with search_jobs, save_job tools
- **General Agent**: Cover letters, LinkedIn messages, general career advice

### 6B. Planned Agent Enhancements

**New tools to add to agents**:

```python
# Resume Agent tools (NEW)
@tool
def extract_resume_from_pdf(file_path: str) -> str:
    """AI-powered structured extraction from resume PDF/DOCX."""
    # Uses LLM to parse raw_text into structured fields
    ...

@tool
def optimize_resume_for_jd(resume_id: int, job_id: int) -> str:
    """Tailor resume bullets to match a specific job description."""
    # Compares resume experience vs JD requirements
    # Rewrites bullets with relevant keywords
    ...

@tool
def calculate_ats_score(resume_id: int, job_id: int) -> str:
    """Score resume against JD for ATS keyword matching."""
    ...

# Job Agent tools (NEW)
@tool
def extract_jd_skills(description: str) -> str:
    """Extract required/preferred skills from a job description."""
    # Uses LLM structured output to pull skills, requirements
    ...

@tool
def analyze_skill_gap(resume_id: int, job_id: int) -> str:
    """Compare user skills against JD requirements, identify gaps."""
    ...

# Interview Agent tools (NEW)
@tool
def generate_interview_questions(job_id: int, question_type: str) -> str:
    """Generate role-specific interview questions from JD."""
    ...

@tool
def evaluate_answer(question: str, answer: str, job_context: str) -> str:
    """Score an interview answer on relevance, structure, specificity."""
    ...
```

### 6C. Market Watcher Agent (Phase 3 - Planned)

```python
# Proactive background agent
# Runs on configurable schedule (default: every 6 hours)
# Workflow:
#   1. Wake up (APScheduler trigger)
#   2. Scan target company career pages
#   3. Extract JDs, embed with NV-Embed-v1
#   4. Semantic match against user resume embeddings in Qdrant
#   5. Gap analysis for high-match results
#   6. In-app notification (no external email needed for v1)
```

---

## 7. Frontend: Next.js Dashboard

### Architecture

Single-page dashboard with panel-based navigation. No routing complexity — one page, six panels.

### Directory Structure (Current)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.jsx              # Main dashboard (panel switcher)
│   │   ├── _app.jsx               # ToastContainer, global providers
│   │   └── _document.jsx          # HTML structure
│   │
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Sidebar.jsx        # Nav + system status indicator
│   │   │   ├── ChatPanel.jsx      # AI chat with voice input, agent display
│   │   │   ├── ResumePanel.jsx    # Resume list + editor with file upload
│   │   │   ├── JobsPanel.jsx      # Job tracker with status pipeline
│   │   │   ├── InterviewPanel.jsx # Mock interview with Hannah + voice I/O
│   │   │   ├── AnalyticsPanel.jsx # Stats cards + score charts
│   │   │   └── SettingsPanel.jsx  # System info, GPU status, PersonaPlex
│   │   └── PersonaPlex/
│   │       └── AvatarWidget.jsx   # Avatar state visualization
│   │
│   ├── hooks/
│   │   ├── useApi.js              # REST client (all backend endpoints)
│   │   ├── useWebSocket.js        # Real-time chat connection
│   │   └── usePersonaPlex.js      # Browser Speech API fallback
│   │
│   └── styles/
│       └── globals.css            # Tailwind + custom animations
│
├── package.json                   # Next.js 14, React 18, Tailwind, Lucide icons
├── next.config.js                 # standalone output, API/WS URL env vars
├── tailwind.config.js
├── Dockerfile                     # Node 20 slim
└── .env.example
```

### Key Frontend Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.400.0",
  "react-toastify": "^10.0.0",
  "react-apexcharts": "^1.4.1",
  "apexcharts": "^4.1.0",
  "clsx": "^2.1.0"
}
```

### Communication Pattern

- **REST**: `useApi.js` → `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`)
- **WebSocket**: `useWebSocket.js` → `NEXT_PUBLIC_WS_URL` (default `ws://localhost:8000`)
- **Speech**: `usePersonaPlex.js` → Browser Web Speech API (fallback when Riva unavailable)

---

## 8. Infrastructure & Docker Compose

### Current State

Two standalone Dockerfiles (backend + frontend). No orchestration yet.

### Target: Full NIM Stack

```yaml
# docker-compose.yml (target - implements Hybrid-Inference Mode B)

services:
  # === NVIDIA NIM: LLM ===
  nim-llm:
    image: nvcr.io/nim/meta/llama-3.1-70b-instruct:latest
    environment:
      - NGC_API_KEY=${NGC_API_KEY}
      - NIM_MAX_MODEL_LEN=8192
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - "8010:8000"
    volumes:
      - nim-llm-cache:/opt/nim/.cache
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/v1/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 5

  # === NVIDIA NIM: Vision (VILA) ===
  nim-vision:
    image: nvcr.io/nim/nvidia/vila:latest
    environment:
      - NGC_API_KEY=${NGC_API_KEY}
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    ports:
      - "8011:8000"
    volumes:
      - nim-vision-cache:/opt/nim/.cache
    profiles: ["full"]  # Only in full deployment

  # === NVIDIA NIM: Embeddings (NV-Embed) ===
  nim-embeddings:
    image: nvcr.io/nim/nvidia/nv-embedqa-e5-v5:latest
    environment:
      - NGC_API_KEY=${NGC_API_KEY}
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    ports:
      - "8012:8000"
    profiles: ["full"]

  # === NVIDIA Riva: Speech (STT + TTS) ===
  riva-speech:
    image: nvcr.io/nvidia/riva/riva-speech:2.17.0
    environment:
      - NGC_API_KEY=${NGC_API_KEY}
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    ports:
      - "50051:50051"
      - "8013:8000"
    profiles: ["full"]

  # === Qdrant: Vector Database ===
  qdrant:
    image: qdrant/qdrant:v1.12.5
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant-data:/qdrant/storage

  # === Piston: Code Execution Sandbox ===
  piston:
    image: ghcr.io/engineer-man/piston:latest
    ports:
      - "2000:2000"
    tmpfs:
      - /piston/jobs
    profiles: ["full"]

  # === CareerOS Backend ===
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NIM_API_BASE=http://nim-llm:8000/v1
      - NIM_MODEL=meta/llama-3.1-70b-instruct
      - RIVA_SPEECH_URL=riva-speech:50051
      - PERSONAPLEX_URL=http://nim-vision:8000
      - QDRANT_URL=http://qdrant:6333
      - DATABASE_URL=sqlite:///./data/careeros.db
      - FRONTEND_URL=http://frontend:3000
    ports:
      - "8000:8000"
    volumes:
      - backend-data:/app/data
      - backend-models:/app/models
    depends_on:
      nim-llm:
        condition: service_healthy
      qdrant:
        condition: service_started

  # === CareerOS Frontend ===
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  nim-llm-cache:
  nim-vision-cache:
  qdrant-data:
  backend-data:
  backend-models:
```

### Deployment Profiles

```bash
# Mode A: Mac / no GPU (backend + frontend + qdrant only)
docker compose up backend frontend qdrant

# Mode B: NVIDIA GPU (full NIM stack)
docker compose --profile full up
```

---

## 9. Feature Specifications

### Feature 1: The "Proactive" Cron-Agent (Market Watcher)

**Concept**: The app doesn't wait. It runs a background task on a configurable schedule.

**Workflow**:
1. **Wake Up**: Triggered by APScheduler timer (default: every 6 hours)
2. **Market Scan**: Fetches career pages from target companies
3. **Embed & Match**: Embeds JDs with NV-Embed-v1, compares against user resume in Qdrant
4. **Gap Analysis**: Uses LLM to identify missing skills for high-match jobs
5. **Notification**: In-app notification on the dashboard: "Found a Senior Role at NVIDIA. You are missing 'TensorRT' experience."

**JD Alignment**: Demonstrates "Action driven with strong analytical skills"

### Feature 2: The "Hannah" Mock Interviewer (Multimodal)

**Voice Mode** (Software Engineering):
1. User speaks to microphone
2. NVIDIA Riva transcribes audio to text (STT)
3. LLM generates follow-up question based on user's resume + JD
4. NVIDIA Riva converts response to speech (TTS)
5. Fallback: Browser Web Speech API when Riva unavailable

**Vision Mode** (Industrial Engineering):
1. User holds up object to webcam
2. Agent captures frame, sends to VILA NIM
3. Agent: "I see you are holding a planetary gear set. Explain how you calculate the gear ratio."

**Coding Mode** (Software Engineering):
1. Agent generates a coding problem from JD requirements
2. User writes code in Monaco Editor
3. Code executes in Piston Docker container
4. Agent evaluates correctness, time complexity O(n), and memory usage

**JD Alignment**: Shows "Experience working with upstream open source projects" (LangChain multimodal)

### Feature 3: The "Skill-Check" Sandbox

**Concept**: If user claims "Python Expert" on their resume, the agent challenges them.

**Workflow**:
1. Agent reads resume skills list
2. Generates a targeted coding problem for the claimed skill
3. User writes code in the React UI (Monaco Editor)
4. Code is sent to Piston Docker container for safe execution
5. Agent provides feedback: correctness, complexity analysis, improvement suggestions

---

## 10. Implementation Roadmap (6-Week Sprints)

### Phase 1: Core & Connectivity (Week 1-2) — ~80% COMPLETE

**Goal**: Hybrid-Inference switch working, basic agent conversation functional.

- [x] FastAPI project structure with lifespan, CORS, routing
- [x] GPU auto-detection (`nvidia-smi` → DGX Spark / NVIDIA / Apple / CPU)
- [x] LLM fallback chain: NIM → llama.cpp → OpenAI API
- [x] `langchain-nvidia-ai-endpoints` integration (`ChatNVIDIA`)
- [x] SQLite database with 6 tables (Resume, Job, Interview, Chat, CoverLetter, Settings)
- [x] Pydantic schemas for all API endpoints
- [x] LangGraph supervisor with 5 agent nodes
- [x] 7 database CRUD tools bound to agents
- [x] WebSocket + REST chat endpoints
- [x] Resume CRUD + PDF/DOCX file upload with text extraction
- [x] Job tracking with status pipeline + stats
- [x] Interview session management + stats
- [x] PersonaPlex service health checks + Riva stubs
- [x] Next.js 14 dashboard with 6 panels
- [x] REST API client hook + WebSocket hook + Browser Speech hook
- [x] AvatarWidget with state visualization
- [x] Dockerfiles for backend + frontend
- [ ] **docker-compose.yml with NIM + Qdrant** ← NEXT
- [ ] Verify NIM containers pull and start on DGX/GPU hardware
- [ ] Verify Riva containers work for STT/TTS

**Deliverable**: `docker compose up` brings up full stack, `/health` returns OK, `/api/status` shows GPU info.

### Phase 2: Agent Intelligence (Week 3-4) — ~20% COMPLETE

**Goal**: Agents do real AI work, not just wrapper LLM calls.

- [x] Basic LLM routing (intent classification)
- [x] System prompts for each agent persona
- [ ] **AI-powered resume parsing** (structured extraction from raw text)
- [ ] **JD skill extraction** (structured output with required/preferred skills)
- [ ] **Skill gap analysis** (resume vs JD comparison with scoring)
- [ ] **Resume optimization** (rewrite bullets to match JD keywords)
- [ ] **ATS scoring** (keyword match percentage)
- [ ] **Interview question generation** (role-specific from JD)
- [ ] **Answer evaluation** (score + feedback with STAR framework check)
- [ ] **SSE streaming** for real-time response display
- [ ] Cover letter generation tool
- [ ] LinkedIn message generation tool

**Deliverable**: Upload resume + paste JD → get tailored resume + skill gap report + interview questions.

### Phase 3: NIM Services & Vector Search (Week 4-5) — NOT STARTED

**Goal**: Full NVIDIA ecosystem integration.

- [ ] Qdrant vector store setup + NV-Embed-v1 integration
- [ ] Resume embedding pipeline (on upload/update)
- [ ] JD embedding pipeline (on save)
- [ ] Semantic resume↔JD matching
- [ ] Riva STT integration (real audio → text streaming)
- [ ] Riva TTS integration (real text → audio streaming)
- [ ] Frontend audio streaming (WebSocket binary frames)
- [ ] VILA vision integration for industrial interview mode
- [ ] Frontend webcam frame capture

**Deliverable**: Voice-powered mock interview with semantic job matching.

### Phase 4: Proactive Agent & Sandbox (Week 5-6) — NOT STARTED

**Goal**: System works autonomously; coding interviews functional.

- [ ] APScheduler background task runner
- [ ] Market Watcher scraping pipeline
- [ ] Notification system (in-app dashboard)
- [ ] Piston code execution integration
- [ ] Monaco Editor in frontend
- [ ] Coding interview mode with execution + evaluation
- [ ] Application tracking board (Kanban-style)

**Deliverable**: System proactively finds jobs; coding interviews execute real code.

### Phase 5: Polish & OSS Contribution (Week 6+)

- [ ] LangSmith agent tracing integration
- [ ] Error handling and graceful fallbacks everywhere
- [ ] Frontend responsive polish
- [ ] **Find and fix a bug in `langchain-nvidia-ai-endpoints`** → submit PR
- [ ] Documentation and README for portfolio
- [ ] Demo video for NVIDIA application

**Deliverable**: Production-quality portfolio piece + open-source contribution.

---

## 11. Hardware Requirements

| User Type | Hardware | Inference Mode | Capabilities |
|-----------|----------|---------------|--------------|
| **Student** | Mac M2/M3/M4 (16GB RAM) | NIM Cloud API or local llama.cpp | Full features via API. Low power. Browser speech. |
| **Pro** | Windows/Linux + RTX 4090 | Local NIM (1 model) | Llama-3-8B locally. Vision/Speech via API. |
| **Enterprise** | NVIDIA DGX Spark / A100 | Local NIM Swarm | Everything runs offline. Maximum privacy. Full PersonaPlex. |

---

## 12. NVIDIA Job Alignment Map

| JD Requirement | CareerOS Feature | Evidence |
|---------------|-----------------|---------|
| "Deep understanding of NVIDIA NIM ecosystem" | Hybrid-Inference architecture, auto-detection, ChatNVIDIA/NVIDIAEmbeddings | `gpu_detect.py`, `llm_provider.py`, `config.py` |
| "Developer workflows" | Mode A/B switching, docker-compose profiles | Entire architecture |
| "Experience with upstream open source projects" | LangChain multimodal integration, potential PR to `langchain-nvidia-ai-endpoints` | Phase 5 goal |
| "Day-0 support for new models" | Model-agnostic config, easy to swap NIM images | `config.py` NIM_MODEL setting |
| "Action driven with strong analytical skills" | Proactive Market Watcher agent | Phase 4 |
| "Complex agent logic, not just API calls" | LangGraph supervisor with cyclic routing, tool execution, state management | `orchestrator.py` |

---

## 13. Risk Analysis & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **NIM model quality < GPT-4o** | Lower resume/interview quality | Benchmark on resume tasks; keep OpenAI as fallback; use larger models on DGX |
| **GPU memory constraints** | Can't run all NIMs simultaneously | Docker compose profiles (`full` vs default); model scheduling; 8B for low-priority |
| **LangGraph complexity** | Agent loops, deadlocks | Recursion limits set; LangSmith tracing; unit tests per node |
| **Riva availability** | Language/accent coverage | Browser Web Speech API as automatic fallback (already implemented) |
| **Piston sandbox security** | Code execution risks | tmpfs mount, no network access, timeout limits |
| **llama.cpp on Mac** | Slow for large models | Use 3B model for routing, 8B for generation; recommend API fallback for Mac |

---

## Summary

CareerOS is a **proactive, local-first, multimodal AI career agent** that demonstrates mastery of the NVIDIA NIM ecosystem. The architecture:

1. **Automatically adapts** to hardware (DGX Spark → NVIDIA GPU → Apple Silicon → CPU)
2. **Uses LangGraph** for stateful, cyclic agent workflows with supervisor routing
3. **Integrates NVIDIA NIM** for LLM, Vision, Embeddings, and Speech services
4. **Runs locally** — all data stays on the user's machine (SQLite + local files)
5. **Acts proactively** — Market Watcher finds jobs and identifies skill gaps
6. **Coaches multimodally** — voice (Riva), vision (VILA), code execution (Piston)

Each feature is designed not just to be useful, but to create **demonstrable evidence** of NVIDIA ecosystem expertise for the job application.
