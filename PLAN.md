# CareerOS: ResumeGuru.IO Agentic AI Rewrite Plan

## Table of Contents

1. [Current Architecture Analysis](#1-current-architecture-analysis)
2. [Executive Summary: CareerOS Agent](#2-executive-summary-careeros-agent)
3. [Target Architecture](#3-target-architecture)
4. [Tech Stack & Components](#4-tech-stack--components)
5. [Backend Rewrite: Python Agent System](#5-backend-rewrite-python-agent-system)
6. [Agent Modules & LangGraph Workflows](#6-agent-modules--langgraph-workflows)
7. [Frontend Migration Strategy](#7-frontend-migration-strategy)
8. [Infrastructure & Docker Compose](#8-infrastructure--docker-compose)
9. [Data Migration](#9-data-migration)
10. [Implementation Phases](#10-implementation-phases)
11. [File-by-File Migration Map](#11-file-by-file-migration-map)
12. [Risk Analysis & Mitigations](#12-risk-analysis--mitigations)

---

## 1. Current Architecture Analysis

### What Exists Today

**Frontend (`llmfrontend/`)** - Next.js 13.3 + React 18 + Tailwind CSS
- 120+ files across pages, components, helpers, API routes
- AI logic split between:
  - **Next.js API routes** (`pages/api/`) - Server-side OpenAI/Azure calls
  - **LangChain JS helpers** (`helpers/langChain/`) - Prompt templates + Zod schemas
  - **LLM Agents** (`helpers/llmAgents/interviewAgent.js`) - Early LangGraph StateGraph prototype
- Uses `@langchain/core@0.1.53`, `@langchain/langgraph@0.0.21`, `langchain@0.0.214` (outdated JS versions)
- AI calls go directly to Azure OpenAI (GPT-4o) from Next.js API routes
- Firebase Auth, MongoDB Atlas, Cloudflare R2, Stripe, SendGrid, Sentry

**Backend (`llmbackend/`)** - Python FastAPI + AutoGen
- **4 core files**: `main.py`, `autogen_group_chat.py`, `user_proxy_webagent.py`, `groupchatweb.py`
- WebSocket-based mock interview with AutoGen GroupChat (4 agents: Interviewer, DBSearch, Feedback, Critic)
- Azure OpenAI GPT-4o via AutoGen's `config_list`
- MongoDB for chat logging and JD retrieval

### Key Problems to Solve

| Problem | Current State | Target State |
|---------|--------------|--------------|
| **Reactive only** | User must initiate every action | Proactive: agents find jobs, notify user |
| **Cloud-dependent AI** | All inference via Azure OpenAI | Local NVIDIA NIM (privacy, speed, cost) |
| **Fragmented AI logic** | Split across JS frontend + Python backend | Unified Python agent orchestration |
| **No vision/multimodal** | Text-only | VILA/LLaVA for visual interview coaching |
| **No speech** | Azure Speech SDK (cloud) | NVIDIA Riva (local, <100ms latency) |
| **Stateless workflows** | Simple request-response chains | LangGraph stateful cyclic workflows with memory |
| **No autonomous browsing** | Manual job applications | Headless browser agent for auto-apply |
| **Outdated LangChain** | JS v0.0.214 | Python LangChain v0.3+ / LangGraph v0.2+ |

---

## 2. Executive Summary: CareerOS Agent

CareerOS is a **full-lifecycle Career Manager** that runs on local NVIDIA hardware. Unlike the current ResumeGuru (which is reactive and cloud-dependent), CareerOS:

1. **Proactively** finds jobs, analyzes skill gaps, and notifies you
2. **Coaches multimodally** - vision (VLM for physical objects), voice (Riva STT/TTS), code execution
3. **Runs locally** - all resumes, strategies, recordings stay on your Docker swarm
4. **Acts autonomously** - fills applications, manages your pipeline

---

## 3. Target Architecture

```
+------------------+     +------------------+     +-------------------+
|   User Device    |     |  Next.js Frontend|     |  FastAPI + LangGraph
|  (Mac/PC/Mobile) |---->|  (Dashboard UI)  |---->|  (Agent Orchestrator)
|                  |     |  + React Webcam   |     |                   |
+------------------+     +------------------+     +--------+----------+
                                                           |
                              +----------------------------+----------------------------+
                              |                            |                            |
                    +---------v---------+      +-----------v----------+    +------------v-----------+
                    | Supervisor Agent  |      |  Market Watcher Agent |    | Interview Coach Agent  |
                    | (LangGraph Router)|      |  (Proactive Loop)    |    | (Multimodal)           |
                    +-------------------+      +----------------------+    +------------------------+
                              |                            |                            |
              +---------------+---------------+            |            +---------------+---------------+
              |               |               |            |            |               |               |
     +--------v------+ +-----v-------+ +-----v-----+  +--v---+  +----v----+   +-------v------+ +------v------+
     | Resume Analyst | | Application | | Gap       |  |Celery|  |NIM:VILA |   |NIM:Llama3-70B| | Piston      |
     | Agent          | | Bot Agent   | | Analyzer  |  |+Redis|  |(Vision) |   |(Reasoning)   | | (Code Exec) |
     +----------------+ +-------------+ +-----------+  +------+  +---------+   +--------------+ +-------------+
              |                                                        |               |
     +--------v--------+                                      +-------v-------+ +------v------+
     | NV-Embed-v1     |                                      | NVIDIA Riva   | | Qdrant      |
     | (Embeddings)    |                                      | (STT/TTS)     | | (Vector DB) |
     +-----------------+                                      +---------------+ +-------------+
```

---

## 4. Tech Stack & Components

| Component | Technology | Role |
|-----------|-----------|------|
| **Orchestration** | LangGraph (Python) | Stateful cyclic agent workflows, supervisor routing |
| **LLM Inference** | NVIDIA NIM (Docker) | Llama 3 70B (reasoning), Mistral Large (coding) |
| **Vision AI** | NVIDIA NIM | VILA / LLaVA-Next for visual analysis |
| **Embeddings** | NVIDIA NIM | NV-Embed-v1 for semantic matching |
| **Speech** | NVIDIA Riva | Real-time STT/TTS, <100ms latency |
| **Vector DB** | Qdrant (Docker) | Job embeddings, resume versions, semantic search |
| **Proactive Loop** | Celery + Redis | Scheduled "Market Watcher" tasks (configurable interval) |
| **Code Sandbox** | Piston (Docker) | Safe code execution during technical interviews |
| **Web Scraping** | Playwright / browser-use | Headless browser for job scraping and auto-apply |
| **Frontend** | Next.js 14+ + Tailwind | Dashboard, video interview UI, real-time streaming |
| **Database** | MongoDB Atlas (existing) | User data, resumes, chat logs (migrated schema) |
| **Auth** | Firebase Auth (existing) | Keep existing auth - no migration needed |
| **Payments** | Stripe (existing) | Keep existing billing - no migration needed |
| **Agent Framework** | LangChain v0.3+ Python | Chains, tools, structured output, NVIDIA integration |
| **NVIDIA SDK** | `langchain-nvidia-ai-endpoints` | ChatNVIDIA, NVIDIAEmbeddings LangChain integration |
| **Monitoring** | LangSmith + Sentry | Agent trace debugging, error tracking |

---

## 5. Backend Rewrite: Python Agent System

### Directory Structure

```
llmbackend/
├── src/
│   ├── main.py                          # FastAPI app entry point
│   ├── config.py                        # Settings via pydantic-settings
│   ├── dependencies.py                  # Shared FastAPI dependencies
│   │
│   ├── agents/                          # LangGraph Agent Definitions
│   │   ├── __init__.py
│   │   ├── supervisor.py                # Supervisor agent (routes to sub-agents)
│   │   ├── resume_analyst.py            # Resume rewrite, skills analysis, gap analysis
│   │   ├── market_watcher.py            # Proactive job scraping + semantic matching
│   │   ├── interview_coach.py           # Multimodal interview coaching
│   │   ├── application_bot.py           # Autonomous job application submission
│   │   └── cover_letter.py              # Cover letter generation agent
│   │
│   ├── graphs/                          # LangGraph Workflow Definitions
│   │   ├── __init__.py
│   │   ├── career_graph.py              # Main supervisor graph
│   │   ├── interview_graph.py           # Interview session subgraph
│   │   ├── resume_graph.py              # Resume processing subgraph
│   │   ├── watcher_graph.py             # Market watcher proactive graph
│   │   └── application_graph.py         # Auto-apply subgraph
│   │
│   ├── tools/                           # LangChain Tools
│   │   ├── __init__.py
│   │   ├── job_scraper.py               # Playwright-based job scraper
│   │   ├── resume_parser.py             # PDF/DOCX resume parsing
│   │   ├── code_executor.py             # Piston sandbox integration
│   │   ├── vector_store.py              # Qdrant vector operations
│   │   ├── mongodb_tools.py             # MongoDB CRUD operations
│   │   ├── notification.py              # Email/Slack/webhook notifications
│   │   └── browser_agent.py             # Autonomous browser for auto-apply
│   │
│   ├── models/                          # Pydantic Models & Schemas
│   │   ├── __init__.py
│   │   ├── resume.py                    # Resume data models
│   │   ├── job.py                       # Job description models
│   │   ├── interview.py                 # Interview session models
│   │   ├── agent_state.py               # LangGraph state definitions
│   │   └── user.py                      # User profile models
│   │
│   ├── llm/                             # LLM Provider Configuration
│   │   ├── __init__.py
│   │   ├── nvidia_nim.py                # ChatNVIDIA / NVIDIAEmbeddings setup
│   │   ├── vision.py                    # VILA/LLaVA NIM client
│   │   └── speech.py                    # Riva STT/TTS client
│   │
│   ├── api/                             # FastAPI Route Handlers
│   │   ├── __init__.py
│   │   ├── resume.py                    # Resume CRUD + AI rewrite endpoints
│   │   ├── interview.py                 # Interview session WebSocket + REST
│   │   ├── jobs.py                      # Job search, matching, applications
│   │   ├── cover_letter.py              # Cover letter generation
│   │   ├── dashboard.py                 # Dashboard stats and pipeline
│   │   ├── notifications.py             # Notification preferences
│   │   └── ws.py                        # WebSocket manager for streaming
│   │
│   ├── tasks/                           # Celery Background Tasks
│   │   ├── __init__.py
│   │   ├── celery_app.py                # Celery configuration
│   │   ├── market_scan.py               # Scheduled job market scanning
│   │   └── embedding_sync.py            # Background embedding generation
│   │
│   └── middleware/                       # FastAPI Middleware
│       ├── __init__.py
│       ├── auth.py                       # Firebase token verification
│       └── cors.py                       # CORS configuration
│
├── tests/
│   ├── test_agents/
│   ├── test_graphs/
│   ├── test_tools/
│   └── test_api/
│
├── docker-compose.yml                    # Full stack orchestration
├── Dockerfile                            # Backend container
├── requirements.txt                      # Python dependencies
├── pyproject.toml                        # Project metadata
└── .env.example                          # Environment template
```

### New `requirements.txt`

```
# Core Framework
fastapi>=0.115.0
uvicorn[standard]>=0.34.0
python-multipart>=0.0.18
websockets>=14.0
pydantic>=2.10.0
pydantic-settings>=2.7.0

# LangChain + LangGraph
langchain>=0.3.14
langchain-core>=0.3.28
langgraph>=0.2.60
langchain-community>=0.3.14
langsmith>=0.2.10

# NVIDIA AI Endpoints
langchain-nvidia-ai-endpoints>=0.3.8

# NVIDIA Riva (Speech)
nvidia-riva-client>=2.17.0

# Vector Database
langchain-qdrant>=0.2.0
qdrant-client>=1.12.0

# Database
pymongo[srv]>=4.10.0
motor>=3.6.0

# Background Tasks
celery[redis]>=5.4.0
redis>=5.2.0

# Web Scraping
playwright>=1.49.0
browser-use>=0.1.0
beautifulsoup4>=4.12.0

# Document Processing
pypdf>=5.1.0
python-docx>=1.1.0
pdf2image>=1.17.0

# Auth
firebase-admin>=6.6.0
python-jose[cryptography]>=3.3.0

# HTTP Client
httpx>=0.28.0
aiohttp>=3.11.0

# Utilities
python-dotenv>=1.0.1
python-dateutil>=2.9.0

# Monitoring
sentry-sdk[fastapi]>=2.19.0

# Dev/Test
pytest>=8.3.0
pytest-asyncio>=0.24.0
pytest-cov>=6.0.0
ruff>=0.8.0
```

---

## 6. Agent Modules & LangGraph Workflows

### 6A. Supervisor Agent (Main Router)

```python
# src/graphs/career_graph.py (conceptual)

from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent

class CareerState(TypedDict):
    messages: Annotated[list, add_messages]
    user_profile: dict
    current_task: str          # "resume_rewrite" | "interview" | "job_search" | "apply"
    job_matches: list[dict]
    resume_data: dict
    interview_state: dict
    next_agent: str

def supervisor_node(state: CareerState) -> CareerState:
    """Routes to the appropriate sub-agent based on user intent or proactive triggers."""
    # Uses Llama 3 70B to classify intent and route
    ...

def build_career_graph():
    graph = StateGraph(CareerState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("resume_analyst", resume_analyst_node)
    graph.add_node("market_watcher", market_watcher_node)
    graph.add_node("interview_coach", interview_coach_node)
    graph.add_node("application_bot", application_bot_node)
    graph.add_node("cover_letter", cover_letter_node)

    graph.add_edge(START, "supervisor")
    graph.add_conditional_edges("supervisor", route_to_agent, {
        "resume": "resume_analyst",
        "search": "market_watcher",
        "interview": "interview_coach",
        "apply": "application_bot",
        "cover_letter": "cover_letter",
        "done": END,
    })

    # Sub-agents can loop back to supervisor
    for agent in ["resume_analyst", "market_watcher", "interview_coach",
                   "application_bot", "cover_letter"]:
        graph.add_edge(agent, "supervisor")

    return graph.compile(checkpointer=MemorySaver())
```

### 6B. Market Watcher Agent (Proactive)

```python
# src/agents/market_watcher.py (conceptual)

class MarketWatcherState(TypedDict):
    user_profile: dict
    target_roles: list[str]
    target_companies: list[str]
    scraped_jobs: list[dict]
    matched_jobs: list[dict]
    notifications_sent: list[str]

def scrape_jobs_node(state):
    """Uses Playwright to scrape target job boards."""
    # Scrapes LinkedIn, company career pages, Indeed
    # Returns raw JD text + metadata
    ...

def embed_and_match_node(state):
    """Embeds JDs with NV-Embed-v1, matches against user profile."""
    # Uses NVIDIAEmbeddings for semantic similarity
    # Threshold: score > 0.85 triggers notification
    ...

def gap_analysis_node(state):
    """Analyzes skill gaps for high-match jobs."""
    # Uses Llama 3 70B to compare JD requirements vs user skills
    # Produces: missing skills, recommended learning path
    ...

def notify_user_node(state):
    """Sends notification with match results + gap analysis."""
    # Email, Slack webhook, or in-app notification
    ...

# Celery periodic task
@celery_app.task
def run_market_scan(user_id: str):
    """Runs every 6 hours (configurable per user)."""
    graph = build_watcher_graph()
    result = graph.invoke({"user_id": user_id, ...})
    ...
```

### 6C. Interview Coach Agent (Multimodal)

```python
# src/agents/interview_coach.py (conceptual)

class InterviewState(TypedDict):
    messages: Annotated[list, add_messages]
    job_description: dict
    role_type: str              # "software" | "industrial" | "behavioral" | "system_design"
    interview_mode: str         # "text" | "voice" | "video" | "coding"
    camera_frames: list[bytes]  # For vision-based coaching
    code_submissions: list[dict]
    feedback_history: list[dict]
    score: float

# Software Engineering Mode
def coding_challenge_node(state):
    """Presents coding problems, executes via Piston, analyzes complexity."""
    ...

def code_review_node(state):
    """Reviews code for correctness, complexity, and style."""
    # Runs code in Piston sandbox
    # Analyzes O(n) complexity
    # Provides refactoring tips
    ...

# Industrial Engineering / Hardware Mode
def vision_analysis_node(state):
    """Uses VILA NIM to analyze camera frames."""
    # Sends base64 frame to NIM vision endpoint
    # Identifies objects, materials, manufacturing processes
    # Generates contextual interview questions
    ...

# Voice Mode
def speech_to_text_node(state):
    """Converts speech to text via Riva."""
    ...

def text_to_speech_node(state):
    """Converts agent response to speech via Riva."""
    ...
```

### 6D. Resume Analyst Agent

```python
# src/agents/resume_analyst.py (conceptual)

class ResumeAnalystState(TypedDict):
    resume_data: dict           # Parsed resume sections
    job_description: dict       # Target JD
    rewritten_experiences: list[dict]
    skills_analysis: dict       # existing, missing, recommended
    overview_rewrite: str
    cover_letter: str
    ats_score: float

def parse_resume_node(state):
    """Parses uploaded PDF/DOCX into structured data."""
    ...

def rewrite_experiences_node(state):
    """Rewrites professional experiences aligned to JD."""
    # Replaces current: helpers/langChain/prompts/myResume/resume.js
    # Uses ChatNVIDIA with structured output (Zod-equivalent Pydantic models)
    ...

def analyze_skills_node(state):
    """Identifies existing, missing, and recommended skills."""
    # Replaces current: resumeAiTargetSkillsModel
    ...

def rewrite_overview_node(state):
    """Rewrites resume overview/summary."""
    # Replaces current: pages/api/rewriteOverview.js
    ...

def generate_ats_score_node(state):
    """Scores resume against ATS keyword matching."""
    ...
```

### 6E. Application Bot Agent

```python
# src/agents/application_bot.py (conceptual)

class ApplicationState(TypedDict):
    job_url: str
    tailored_resume_pdf: bytes
    cover_letter: str
    application_fields: dict
    status: str                 # "pending" | "submitted" | "failed"

def navigate_to_portal_node(state):
    """Opens job application portal via headless browser."""
    ...

def fill_application_node(state):
    """Fills form fields using browser automation."""
    ...

def upload_documents_node(state):
    """Uploads tailored resume PDF and cover letter."""
    ...

def confirm_submission_node(state):
    """Verifies submission and logs status."""
    ...
```

---

## 7. Frontend Migration Strategy

### What Changes

| Current (Next.js API Routes) | New (FastAPI Backend) |
|-------------------------------|----------------------|
| `pages/api/rewriteOverview.js` -> Direct Azure OpenAI call | `POST /api/v1/resume/rewrite-overview` -> Agent graph |
| `pages/api/jdInfoExtractLangChainStreaming.js` -> LangChain JS | `POST /api/v1/jobs/extract-jd` -> Agent tool |
| `pages/api/streaming/myResume/experienceRewrite.js` | `POST /api/v1/resume/rewrite-experience` (SSE) |
| `pages/api/searchJdExtractor.js` | `POST /api/v1/jobs/search` |
| WebSocket mock interview (autogen backend) | `WS /api/v1/interview/{session_id}` (LangGraph) |
| `helpers/langChain/*` (JS prompts/functions) | Python `src/agents/*` + `src/models/*` |
| `helpers/helperApis/*` (frontend API calls) | Updated to call new FastAPI endpoints |

### What Stays the Same

- **Firebase Auth** - keep existing `helpers/firebase/firebase.js`
- **MongoDB helpers** - keep `helpers/mongodb/*` (read operations)
- **Stripe** - keep `pages/api/stripe/*`
- **Email** - keep `pages/api/mail/*`
- **UI Components** - keep all React components, update data fetching
- **PDF generation** - keep `pages/api/pdf/*`
- **Resume parser** - replace JS `parse-resume-from-pdf/` with Python backend

### Frontend Changes Required

1. **New API client** (`helpers/api/careerOsClient.js`):
   - REST calls to FastAPI backend
   - SSE streaming for real-time responses
   - WebSocket connection for interview sessions

2. **New dashboard page** (`pages/dashboard/pipeline.js`):
   - Job match pipeline view
   - Proactive notification center
   - Application tracking

3. **Updated interview page** (`components/mockinterview/*`):
   - WebSocket → new FastAPI WS endpoint
   - Add webcam frame capture (every 2s) for vision mode
   - Add coding editor panel with Piston execution

4. **Upgrade Next.js** from 13.3 to 14+ (App Router optional, can stay Pages Router)

---

## 8. Infrastructure & Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  # ============================================
  # NVIDIA NIM: LLM (Llama 3 70B Instruct)
  # ============================================
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
              count: 2  # 70B needs ~2x A100/H100
              capabilities: [gpu]
    ports:
      - "8000:8000"
    volumes:
      - nim-llm-cache:/opt/nim/.cache
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/v1/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 5

  # ============================================
  # NVIDIA NIM: Vision (VILA / LLaVA)
  # ============================================
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
      - "8001:8000"
    volumes:
      - nim-vision-cache:/opt/nim/.cache

  # ============================================
  # NVIDIA NIM: Embeddings (NV-Embed-v1)
  # ============================================
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
      - "8002:8000"

  # ============================================
  # NVIDIA Riva: Speech (STT + TTS)
  # ============================================
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
      - "50051:50051"   # gRPC
      - "8003:8000"     # HTTP

  # ============================================
  # Qdrant: Vector Database
  # ============================================
  qdrant:
    image: qdrant/qdrant:v1.12.5
    ports:
      - "6333:6333"     # HTTP
      - "6334:6334"     # gRPC
    volumes:
      - qdrant-data:/qdrant/storage

  # ============================================
  # Redis: Celery Broker + Cache
  # ============================================
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # ============================================
  # CareerOS Backend: FastAPI + LangGraph
  # ============================================
  backend:
    build:
      context: ./llmbackend
      dockerfile: Dockerfile
    environment:
      - NIM_LLM_URL=http://nim-llm:8000/v1
      - NIM_VISION_URL=http://nim-vision:8000/v1
      - NIM_EMBEDDINGS_URL=http://nim-embeddings:8000/v1
      - RIVA_URL=riva-speech:50051
      - QDRANT_URL=http://qdrant:6333
      - REDIS_URL=redis://redis:6379/0
      - MONGODB_URI=${MONGODB_URI}
      - FIREBASE_CREDENTIALS=${FIREBASE_CREDENTIALS}
    ports:
      - "8080:8080"
    volumes:
      - ./llmbackend:/app
    depends_on:
      nim-llm:
        condition: service_healthy
      qdrant:
        condition: service_started
      redis:
        condition: service_started

  # ============================================
  # Celery Worker: Background Tasks
  # ============================================
  celery-worker:
    build:
      context: ./llmbackend
      dockerfile: Dockerfile
    command: celery -A src.tasks.celery_app worker -l info
    environment:
      - NIM_LLM_URL=http://nim-llm:8000/v1
      - NIM_EMBEDDINGS_URL=http://nim-embeddings:8000/v1
      - QDRANT_URL=http://qdrant:6333
      - REDIS_URL=redis://redis:6379/0
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - backend
      - redis

  # ============================================
  # Celery Beat: Scheduler (Market Watcher)
  # ============================================
  celery-beat:
    build:
      context: ./llmbackend
      dockerfile: Dockerfile
    command: celery -A src.tasks.celery_app beat -l info
    environment:
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis

  # ============================================
  # Piston: Code Execution Sandbox
  # ============================================
  piston:
    image: ghcr.io/engineer-man/piston:latest
    ports:
      - "2000:2000"
    tmpfs:
      - /piston/jobs

  # ============================================
  # Frontend: Next.js
  # ============================================
  frontend:
    build:
      context: ./llmfrontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
      - NEXT_PUBLIC_WS_URL=ws://backend:8080
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  nim-llm-cache:
  nim-vision-cache:
  qdrant-data:
  redis-data:
```

### Environment Variables (`.env`)

```bash
# NVIDIA
NGC_API_KEY=your-ngc-api-key

# MongoDB (existing)
MONGODB_URI=mongodb+srv://...
TLS_CERTIFICATE_KEY_FILE=./certs/cert.pem

# Firebase (existing)
FIREBASE_CREDENTIALS=./certs/firebase-sa.json

# Stripe (existing)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Notifications
SENDGRID_API_KEY=SG...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...

# LangSmith (optional monitoring)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls_...
LANGCHAIN_PROJECT=careeros

# Market Watcher
WATCHER_INTERVAL_HOURS=6
WATCHER_MATCH_THRESHOLD=0.85
```

---

## 9. Data Migration

### MongoDB Schema Changes

**Existing collections** (keep as-is):
- `users` - Firebase user profiles
- `resumes` - Resume data
- `jobDescription` - Extracted JD data
- `mockInterviewChatLog` - Interview logs

**New collections**:

```javascript
// job_matches - Proactive job matching results
{
  userId: string,
  jobUrl: string,
  jobTitle: string,
  company: string,
  matchScore: float,           // 0.0 - 1.0
  gapAnalysis: {
    missingSkills: string[],
    recommendations: string[],
  },
  applicationStatus: string,   // "matched" | "approved" | "applied" | "rejected"
  scrapedAt: Date,
  appliedAt: Date | null,
  embedding_id: string,        // Reference to Qdrant vector
}

// agent_sessions - LangGraph session state
{
  userId: string,
  sessionId: string,
  graphType: string,           // "career" | "interview" | "resume" | "watcher"
  checkpoint: object,          // LangGraph checkpoint data
  createdAt: Date,
  lastActiveAt: Date,
}

// interview_sessions - Enhanced interview tracking
{
  userId: string,
  sessionId: string,
  jobDescriptionId: string,
  mode: string,                // "text" | "voice" | "video" | "coding"
  roleType: string,            // "software" | "industrial" | "behavioral"
  questions: [{
    question: string,
    userAnswer: string,
    feedback: string,
    score: float,
    timestamp: Date,
  }],
  overallScore: float,
  codeSubmissions: [{
    code: string,
    language: string,
    output: string,
    passed: boolean,
  }],
  visionFrames: string[],     // S3/R2 paths to captured frames
}

// notification_preferences
{
  userId: string,
  channels: string[],          // ["email", "slack", "in_app"]
  watcherEnabled: boolean,
  watcherIntervalHours: number,
  targetRoles: string[],
  targetCompanies: string[],
  matchThreshold: float,
}
```

### Qdrant Collections

```python
# user_profiles - User resume embeddings
# Dimension: 1024 (NV-Embed-v1)
# Fields: userId, resumeId, section, text

# job_descriptions - Scraped JD embeddings
# Dimension: 1024
# Fields: jobUrl, title, company, scrapedAt, rawText
```

---

## 10. Implementation Phases

### Phase 1: Infrastructure Foundation

**Goal**: Docker stack running with NIM endpoints accessible.

- [ ] Set up `docker-compose.yml` with all services
- [ ] Verify NVIDIA Container Toolkit on DGX/server
- [ ] Pull and test NIM containers (LLM, Vision, Embeddings)
- [ ] Deploy Qdrant, Redis, Piston
- [ ] Create new FastAPI project structure
- [ ] Set up `langchain-nvidia-ai-endpoints` integration
- [ ] Verify ChatNVIDIA + NVIDIAEmbeddings work against local NIMs
- [ ] Basic health check endpoints

**Deliverable**: `docker compose up` brings up full stack, `/health` returns OK.

### Phase 2: Core Agent System

**Goal**: Supervisor + Resume Analyst agents working end-to-end.

- [ ] Implement `CareerState` and LangGraph state management
- [ ] Build Supervisor agent with intent classification
- [ ] Port resume rewrite logic from JS to Python agents:
  - Experience rewrite (replaces `helpers/langChain/prompts/myResume/resume.js`)
  - Overview rewrite (replaces `pages/api/rewriteOverview.js`)
  - Skills analysis (replaces `resumeAiTargetSkillsModel`)
  - ATS scoring (new feature)
- [ ] Port JD extraction (replaces `pages/api/jdInfoExtractLangChainStreaming.js`)
- [ ] Port cover letter generation (replaces `helpers/langChain/functions/coverLetter.js`)
- [ ] Implement FastAPI REST endpoints with SSE streaming
- [ ] Update frontend `helperApis/` to call new backend
- [ ] MongoDB schema migration for new collections

**Deliverable**: Resume rewrite, JD extraction, cover letter work via new Python backend.

### Phase 3: Market Watcher (Proactive Intelligence)

**Goal**: System proactively finds jobs and notifies users.

- [ ] Implement Playwright-based job scraper tool
- [ ] Build embedding pipeline with NV-Embed-v1
- [ ] Implement semantic matching against user profile
- [ ] Build gap analysis agent node
- [ ] Set up Celery + Redis periodic tasks
- [ ] Build notification system (email, Slack, in-app)
- [ ] Create frontend notification center / pipeline dashboard
- [ ] Add user preference management (target roles, companies, threshold)

**Deliverable**: System runs every N hours, finds matching jobs, sends notifications.

### Phase 4: Interview Coach (Multimodal)

**Goal**: Full multimodal interview coaching system.

- [ ] Rewrite mock interview from AutoGen GroupChat to LangGraph
- [ ] Implement software engineering mode:
  - Coding challenge generation
  - Piston code execution integration
  - Complexity analysis + refactoring tips
- [ ] Implement industrial/hardware mode:
  - Camera frame capture (React Webcam on frontend)
  - VILA NIM vision analysis
  - Visual-contextual question generation
- [ ] Implement voice mode:
  - Riva STT integration
  - Riva TTS integration
  - Real-time streaming pipeline
- [ ] Implement behavioral interview mode
- [ ] Build interview scoring and feedback system
- [ ] Update frontend interview UI components

**Deliverable**: Multi-mode interview coaching with voice, video, coding support.

### Phase 5: Application Bot (Autonomous Apply)

**Goal**: Agent can auto-fill and submit job applications.

- [ ] Implement browser automation agent (Playwright / browser-use)
- [ ] Build application form field detection
- [ ] Implement document upload automation
- [ ] Add human-in-the-loop confirmation before submission
- [ ] Build application tracking dashboard
- [ ] Add status monitoring and retry logic

**Deliverable**: User approves a job match, agent applies on their behalf.

### Phase 6: Polish & Production

**Goal**: Production-ready system.

- [ ] LangSmith integration for agent tracing
- [ ] Comprehensive error handling and fallbacks
- [ ] Rate limiting and resource management
- [ ] Load testing with multiple concurrent users
- [ ] Security audit (auth, data isolation, sandboxing)
- [ ] Frontend polish (responsive, accessibility)
- [ ] Documentation and admin tools
- [ ] Remove legacy Azure OpenAI / AutoGen code

**Deliverable**: Production-ready CareerOS deployment.

---

## 11. File-by-File Migration Map

### Backend Files to Replace

| Current File | Replaced By | Notes |
|-------------|------------|-------|
| `llmbackend/src/main.py` | `src/main.py` (new FastAPI) | Complete rewrite |
| `llmbackend/src/autogen_group_chat.py` | `src/agents/interview_coach.py` + `src/graphs/interview_graph.py` | AutoGen → LangGraph |
| `llmbackend/src/user_proxy_webagent.py` | `src/api/ws.py` (WebSocket manager) | AutoGen proxy → FastAPI WS |
| `llmbackend/src/groupchatweb.py` | `src/graphs/career_graph.py` | AutoGen GroupChat → LangGraph |

### Frontend AI Files to Replace

| Current File | Replaced By | Notes |
|-------------|------------|-------|
| `helpers/langChain/prompts/myResume/resume.js` | Backend `src/agents/resume_analyst.py` | Prompts move to Python |
| `helpers/langChain/prompts/myResumeEdit/experience.js` | Backend `src/agents/resume_analyst.py` | |
| `helpers/langChain/prompts/myResumeEdit/overviewSummary.js` | Backend `src/agents/resume_analyst.py` | |
| `helpers/langChain/prompts/coverLetter.js` | Backend `src/agents/cover_letter.py` | |
| `helpers/langChain/prompts/interviewQuestions/*` | Backend `src/agents/interview_coach.py` | |
| `helpers/langChain/prompts/mockInterview/*` | Backend `src/agents/interview_coach.py` | |
| `helpers/langChain/prompts/jobSearch/*` | Backend `src/agents/market_watcher.py` | |
| `helpers/langChain/prompts/linkedinMessage/*` | Backend `src/agents/cover_letter.py` | Generalized |
| `helpers/langChain/functions/myResume/resume.js` | Backend `src/models/resume.py` (Pydantic) | Zod → Pydantic |
| `helpers/langChain/functions/coverLetter.js` | Backend `src/models/resume.py` | |
| `helpers/llmAgents/interviewAgent.js` | Backend `src/graphs/interview_graph.py` | JS LangGraph → Python LangGraph |
| `helpers/openAI/openai.js` | Backend `src/llm/nvidia_nim.py` | OpenAI → ChatNVIDIA |
| `pages/api/rewriteOverview.js` | Backend `POST /api/v1/resume/rewrite-overview` | Direct Azure call → Agent |
| `pages/api/jdInfoExtractLangChainStreaming.js` | Backend `POST /api/v1/jobs/extract-jd` | |
| `pages/api/streaming/myResume/experienceRewrite.js` | Backend `POST /api/v1/resume/rewrite-experience` | |
| `pages/api/searchJdExtractor.js` | Backend `POST /api/v1/jobs/search` | |

### Frontend Files to Keep (Update API calls only)

| File | Change Required |
|------|----------------|
| `helpers/helperApis/rewriteMyResume.js` | Point to new backend URL |
| `helpers/helperApis/generateCoverLetter.js` | Point to new backend URL |
| `helpers/helperApis/jdInfoExtract.js` | Point to new backend URL |
| `helpers/helperApis/generateInterviewQuestions.js` | Point to new backend URL |
| `helpers/helperApis/professionalExperienceRewrite.js` | Point to new backend URL |
| `helpers/helperApis/searchResumes.js` | Point to new backend URL |
| All `components/*` | Minor prop changes, same structure |
| `helpers/firebase/*` | No changes |
| `helpers/mongodb/*` | Keep for non-AI operations |
| `pages/api/stripe/*` | No changes |
| `pages/api/mail/*` | No changes |
| `pages/api/pdf/*` | No changes |

### New Frontend Files

| New File | Purpose |
|----------|---------|
| `helpers/api/careerOsClient.js` | Central API client for FastAPI backend |
| `helpers/api/streamingClient.js` | SSE + WebSocket streaming utilities |
| `pages/dashboard/pipeline.js` | Job match pipeline dashboard |
| `pages/dashboard/notifications.js` | Proactive notification center |
| `pages/dashboard/applications.js` | Application tracking view |
| `components/interview/CodingEditor.jsx` | Code editor for coding interviews |
| `components/interview/VisionCapture.jsx` | Webcam frame capture for vision mode |
| `components/interview/VoiceControls.jsx` | Voice interview controls (Riva) |
| `components/dashboard/MatchCard.jsx` | Job match card with gap analysis |
| `components/dashboard/PipelineBoard.jsx` | Kanban-style application tracker |

---

## 12. Risk Analysis & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **NIM model quality < GPT-4o** | Lower resume/interview quality | Benchmark Llama 3 70B vs GPT-4o on resume tasks; keep Azure as fallback |
| **GPU memory constraints** | Can't run all NIMs simultaneously | Profile GPU usage; use model scheduling or smaller models (8B) for low-priority tasks |
| **LangGraph complexity** | Agent loops, deadlocks | Extensive unit tests per node; recursion limits; LangSmith tracing |
| **Job scraping blocked** | LinkedIn/Indeed anti-bot | Rotate proxies; use official APIs where available; respect robots.txt |
| **Browser automation fragile** | Application forms vary wildly | Human-in-the-loop confirmation; graceful fallback to manual |
| **Riva model availability** | Language/accent coverage | Start with English; test accent robustness; fallback to Whisper |
| **Migration downtime** | Users lose access | Phase migration; run old + new in parallel; feature flags |
| **Data isolation** | Multi-user security | Strict userId filtering in all queries; Qdrant payload filtering |

---

## Summary

This plan transforms ResumeGuru.IO from a **reactive, cloud-dependent** tool into **CareerOS**: a **proactive, local-first, multimodal AI career agent**. The migration is structured in 6 phases, with each phase delivering standalone value. The core architectural shift is:

1. **AI Backend**: JS LangChain API routes + Python AutoGen → Unified Python FastAPI + LangGraph
2. **LLM Provider**: Azure OpenAI (cloud) → NVIDIA NIM (local)
3. **Agent Model**: Request-response chains → Stateful, cyclic, supervisor-routed agents
4. **Capabilities**: Text-only → Multimodal (vision, voice, code execution)
5. **Behavior**: Reactive → Proactive (Market Watcher + notifications)
