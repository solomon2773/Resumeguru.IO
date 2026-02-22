# CareerOS - AI Career Assistant

Personal AI career assistant powered by LangGraph agents and NVIDIA PersonaPlex.
Designed for a single user. No auth, no payments, no cloud dependencies.

Creator: Solomon Tsao - [LinkedIn](https://www.linkedin.com/in/solomon-tsao/)

## What It Does

- **AI Chat** - Career advice, resume tips, cover letters, LinkedIn messages via LangGraph agents
- **Resume Builder** - Create, edit, upload (PDF/DOCX), and AI-optimize resumes
- **Mock Interview** - Practice with AI interviewer Hannah (voice + text)
- **Job Tracker** - Save job descriptions, track application status, skill gap analysis
- **Analytics** - Interview scores, application pipeline, progress tracking

All in one dashboard. All data stored locally in SQLite.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Python FastAPI, LangGraph agent orchestrator |
| Database | SQLite (local, zero-config) |
| AI Agents | LangGraph with supervisor routing pattern |
| Avatar/Speech | NVIDIA PersonaPlex (GPU) or browser Web Speech API (fallback) |
| LLM | NVIDIA NIM → local llama.cpp → OpenAI API (automatic fallback chain) |

## GPU Support & Automatic Fallback

CareerOS auto-detects your hardware and configures itself:

| Hardware | LLM | Speech | Avatar |
|----------|-----|--------|--------|
| **2x NVIDIA DGX Spark GB10** | NIM (Llama 3.1 70B) | Riva ASR/TTS | PersonaPlex Audio2Face |
| **NVIDIA GPU (16GB+ VRAM)** | NIM (Llama 3.1 8B+) | Riva ASR/TTS | PersonaPlex |
| **NVIDIA GPU (<16GB VRAM)** | NIM (Llama 3.1 8B) | Browser Web Speech | None |
| **Apple Silicon M3/M4/M5** | llama.cpp + Metal | Browser Web Speech | None |
| **CPU only** | llama.cpp (slow) or OpenAI API | Browser Web Speech | None |

## Quick Start

### Docker (Recommended)

```bash
# Clone and start
git clone <repo-url> && cd Resumeguru.IO
cp .env.example .env  # edit if needed

# CPU / Apple Silicon
docker compose up --build

# NVIDIA GPU (with GPU passthrough)
docker compose --profile gpu up --build
```

Frontend: http://localhost:3000
Backend: http://localhost:8000

### Manual Setup

#### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit as needed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### LLM Setup

Choose one:

1. **NVIDIA NIM** (DGX Spark / NVIDIA GPU): Start NIM containers, set `NIM_API_BASE` in `.env`
2. **Local model** (Apple Silicon / CPU): Download a `.gguf` model into `./models/`
3. **OpenAI API**: Set `OPENAI_API_KEY` in `.env`

## Project Structure

```
├── docker-compose.yml          # Auto-starts frontend + backend
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── config.py           # Settings & GPU config
│   │   ├── database.py         # SQLite models
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── agents/
│   │   │   ├── orchestrator.py # LangGraph supervisor router
│   │   │   └── tools.py        # Agent tools (DB access)
│   │   ├── routers/
│   │   │   ├── chat.py         # WebSocket + REST chat
│   │   │   ├── resume.py       # Resume CRUD + upload
│   │   │   ├── jobs.py         # Job tracking
│   │   │   └── interview.py    # Interview sessions
│   │   └── services/
│   │       ├── gpu_detect.py   # Hardware auto-detection
│   │       ├── llm_provider.py # LLM fallback chain
│   │       └── personaplex.py  # PersonaPlex avatar/speech
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/index.jsx     # Single dashboard (no routing)
│   │   ├── components/Dashboard/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── ResumePanel.jsx
│   │   │   ├── JobsPanel.jsx
│   │   │   ├── InterviewPanel.jsx
│   │   │   ├── AnalyticsPanel.jsx
│   │   │   └── SettingsPanel.jsx
│   │   ├── components/PersonaPlex/
│   │   │   └── AvatarWidget.jsx
│   │   └── hooks/
│   │       ├── useApi.js
│   │       ├── useWebSocket.js
│   │       └── usePersonaPlex.js
│   └── package.json
├── llmbackend/                 # (legacy v1 backend)
└── llmfrontend/                # (legacy v1 frontend)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/status` | System status (GPU, PersonaPlex, LLM) |
| POST | `/api/chat/message` | Send message to AI agent |
| WS | `/api/chat/ws/{session_id}` | Real-time chat WebSocket |
| GET/POST | `/api/resumes/` | List/create resumes |
| POST | `/api/resumes/upload` | Upload PDF/DOCX resume |
| GET/POST | `/api/jobs/` | List/create job descriptions |
| GET | `/api/jobs/stats/summary` | Job pipeline stats |
| GET | `/api/interviews/` | List interview sessions |
| GET | `/api/interviews/stats/summary` | Interview score stats |

## License

MIT - see [LICENSE](LICENSE)
