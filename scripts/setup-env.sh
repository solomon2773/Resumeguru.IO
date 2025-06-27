#!/bin/bash

# Environment Setup Script for ResumeGuru
# This script helps set up environment variables for the project

echo "🔒 ResumeGuru Security Setup Script"
echo "=================================="

# Check if .env files already exist
if [ -f "llmbackend/.env" ]; then
    echo "⚠️  Backend .env file already exists. Skipping..."
else
    echo "📝 Creating backend environment file..."
    cp llmbackend/env.example llmbackend/.env
    echo "✅ Backend .env file created from template"
fi

if [ -f "llmfrontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file already exists. Skipping..."
else
    echo "📝 Creating frontend environment file..."
    cp llmfrontend/env.example llmfrontend/.env.local
    echo "✅ Frontend .env.local file created from template"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Edit llmbackend/.env with your actual backend values"
echo "2. Edit llmfrontend/.env.local with your actual frontend values"
echo "3. Never commit these .env files to version control"
echo "4. For production, use your deployment platform's environment variable management"
echo ""
echo "📚 See SECURITY_SETUP.md for detailed instructions"
echo ""

# Check for any remaining hardcoded secrets
echo "🔍 Checking for remaining hardcoded secrets..."
if grep -r "sk-[a-zA-Z0-9]{20,}" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null; then
    echo "⚠️  Found potential hardcoded OpenAI API keys"
fi

if grep -r "AIza[0-9A-Za-z-_]{35}" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null; then
    echo "⚠️  Found potential hardcoded Google API keys"
fi

if grep -r "whsec_[a-zA-Z0-9]{64}" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null; then
    echo "⚠️  Found potential hardcoded Stripe webhook secrets"
fi

echo "✅ Security check complete"
echo ""
echo "🚀 You're ready to start developing securely!" 