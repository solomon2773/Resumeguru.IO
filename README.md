# ResumeGuru V4 - AI-Powered Resume Builder & Interview Assistant

ResumeGuru is a comprehensive AI-powered platform that helps users create professional resumes, cover letters, and prepare for job interviews using advanced language models and AI technologies.

## 🚀 Features

- **AI Resume Builder**: Generate professional resumes tailored to job descriptions
- **Cover Letter Generator**: Create compelling cover letters with AI assistance
- **Mock Interview Simulator**: Practice interviews with AI-powered Hannah
- **JD Extractor**: Extract key information from job descriptions
- **LinkedIn Connection Messages**: Generate professional connection requests
- **Interview Q&A**: Get curated interview questions and AI-generated answers
- **Job Search**: Natural language job search with recommendations
- **Document Management**: Create, edit, download, and share documents

## 🏗️ Architecture

- **Frontend**: Next.js with React, Tailwind CSS
- **Backend**: Python FastAPI with WebSocket support
- **AI Services**: Azure OpenAI, OpenAI GPT models
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth
- **Storage**: Cloudflare R2
- **Payments**: Stripe
- **Speech Services**: Microsoft Azure Speech Services

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- MongoDB Atlas account
- Azure OpenAI account
- Firebase project
- Cloudflare R2 account
- Stripe account

## 🔧 Quick Start

### Option 1: Automated Setup (Recommended)

Run the automated setup script that handles everything:

```bash
git clone <repository-url>
cd resumeguru_V4
./scripts/quick-start.sh
```

This script will:
- Check prerequisites
- Set up environment files
- Install backend dependencies
- Install frontend dependencies
- Guide you through the next steps

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd resumeguru_V4
```

#### 2. Environment Setup

Run the automated setup script:

```bash
./scripts/setup-env.sh
```

This will create the necessary environment files from templates.

#### 3. Backend Setup

##### Install Python Dependencies

```bash
cd llmbackend
pip install -r requirements.txt
```

##### Configure Environment Variables

Edit `llmbackend/.env` with your actual values:

```bash
# WebSocket Authentication
WEBSOCKET_AUTH_KEY=your-websocket-auth-key-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-cluster.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=your-app-name
TLS_CERTIFICATE_KEY_FILE=./path/to/your/certificate.pem

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-azure-openai-api-key-here
AZURE_OPENAI_BASE_URL=https://your-resource.openai.azure.com/

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

##### Start the Backend Server

```bash
cd llmbackend
python src/main.py
```

The backend will be available at `http://localhost:8000`

#### 4. Frontend Setup

##### Install Node.js Dependencies

```bash
cd llmfrontend
npm install
# or
yarn install
```

##### Configure Environment Variables

Edit `llmfrontend/.env.local` with your actual values. See `llmfrontend/env.example` for all required variables.

Key variables to configure:

```bash
# General Configuration
DEV=true
SKA_API_AUTH_TOKEN=your-ska-api-auth-token
SITE_URL=https://localhost:3000

# Firebase Configuration
FIREBASE_PUBLIC_APIKEY=your-firebase-api-key
FIREBASE_PUBLIC_AUTHDOMAIN=your-project.firebaseapp.com
FIREBASE_PUBLIC_PROJECTID=your-project-id

# Azure OpenAI Configuration
MICROSOFT_OPENAI_API_KEY=your-microsoft-openai-api-key
MICROSOFT_OPENAI_API_URL_CHAT=https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-cluster.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=your-app-name
```

##### Start the Frontend Development Server

```bash
cd llmfrontend
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🔐 Security Configuration

### Required Environment Variables

#### Backend (llmbackend/.env)
- `WEBSOCKET_AUTH_KEY`: Authentication key for WebSocket connections
- `MONGODB_URI`: MongoDB connection string
- `TLS_CERTIFICATE_KEY_FILE`: Path to MongoDB certificate file
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API key
- `AZURE_OPENAI_BASE_URL`: Azure OpenAI endpoint URL

#### Frontend (llmfrontend/.env.local)
- `FIREBASE_PUBLIC_*`: Firebase configuration
- `MICROSOFT_OPENAI_*`: Azure OpenAI configuration
- `STRIPE_*`: Stripe payment configuration
- `MONGODB_*`: MongoDB configuration
- `CLOUDFLARE_*`: Cloudflare R2 storage configuration

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate API keys** regularly
4. **Use least privilege access** for all service accounts
5. **Monitor for unauthorized access**

## 🐳 Docker Deployment

### Backend Docker

```bash
cd llmbackend
docker build -t resumeguru-backend .
docker run -p 8000:8000 --env-file .env resumeguru-backend
```

### Frontend Docker

```bash
cd llmfrontend
docker build -t resumeguru-frontend .
docker run -p 3000:3000 --env-file .env.local resumeguru-frontend
```

## 📁 Project Structure

```
resumeguru_V4/
├── llmbackend/                 # Python FastAPI backend
│   ├── src/
│   │   ├── main.py            # Main FastAPI application
│   │   ├── autogen_group_chat.py  # AI chat implementation
│   │   └── ...
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend Docker configuration
│   └── .env                  # Backend environment variables
├── llmfrontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Next.js pages and API routes
│   │   ├── helpers/         # Utility functions and API helpers
│   │   └── ...
│   ├── package.json         # Node.js dependencies
│   ├── next.config.js       # Next.js configuration
│   ├── Dockerfile          # Frontend Docker configuration
│   └── .env.local          # Frontend environment variables
├── scripts/
│   └── setup-env.sh        # Environment setup script
├── SECURITY_SETUP.md       # Security configuration guide
└── README.md              # This file
```

## 🔧 Development

### Backend Development

```bash
cd llmbackend
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
python -m pytest tests/
```

### Frontend Development

```bash
cd llmfrontend
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## 🚀 Production Deployment

### Environment Variables

For production, set environment variables in your deployment platform:

- **Vercel**: Use the dashboard environment variables section
- **Netlify**: Use site settings environment variables
- **Docker**: Use `--env-file` or Docker secrets
- **Kubernetes**: Use ConfigMaps and Secrets

### Required Production Variables

Ensure all environment variables are set for production, especially:
- Database connection strings
- API keys and secrets
- Webhook endpoints
- Payment processing keys

## 🧪 Testing

### Backend Tests

```bash
cd llmbackend
python -m pytest tests/ -v
```

### Frontend Tests

```bash
cd llmfrontend
npm test
npm run test:coverage
```

## 📊 Monitoring & Logging

- **Sentry**: Error tracking and performance monitoring
- **Application Logs**: Check console output for debugging
- **Database Monitoring**: MongoDB Atlas dashboard
- **API Monitoring**: Azure Application Insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `SECURITY_SETUP.md` for security-related questions
- **Issues**: Create an issue in the GitHub repository
- **Email**: Contact the development team

## 🔄 Updates

Keep your dependencies updated:

```bash
# Backend
cd llmbackend
pip install --upgrade -r requirements.txt

# Frontend
cd llmfrontend
npm update
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

**Note**: This is a production application with real user data. Always follow security best practices and keep your environment variables secure. 