# Security Setup Guide

This guide outlines the security measures implemented in the ResumeGuru project and how to properly configure environment variables.

## 🔒 Security Changes Made

### 1. Environment Variables Implementation
- **Backend**: Moved hardcoded authentication keys and database connections to environment variables
- **Frontend**: Moved Stripe webhook secrets and other sensitive data to environment variables
- **Configuration**: All API keys, secrets, and sensitive URLs now use environment variables

### 2. Gitignore Updates
- Added comprehensive `.gitignore` file to exclude:
  - Build artifacts (`.next/`, `out/`, `build/`)
  - Environment files (`.env*`)
  - IDE configuration files (`.idea/`, `.vscode/`)
  - Certificate files (`*.pem`, `*.key`, `*.crt`)
  - Log files and temporary files

### 3. Files Modified
- `llmbackend/src/main.py` - WebSocket auth key and MongoDB URI
- `llmbackend/src/autogen_group_chat.py` - MongoDB URI and Azure OpenAI API key
- `llmfrontend/src/pages/api/stripe/webhook/paymentIntent.js` - Stripe webhook secrets
- `.gitignore` - Comprehensive security exclusions

## 🚀 Setup Instructions

### Backend Setup
1. Copy `llmbackend/env.example` to `llmbackend/.env`
2. Fill in your actual values:
   ```bash
   WEBSOCKET_AUTH_KEY=your-actual-websocket-auth-key
   MONGODB_URI=your-actual-mongodb-connection-string
   AZURE_OPENAI_API_KEY=your-actual-azure-openai-api-key
   AZURE_OPENAI_BASE_URL=your-actual-azure-openai-base-url
   TLS_CERTIFICATE_KEY_FILE=path/to/your/certificate.pem
   ```

### Frontend Setup
1. Copy `llmfrontend/env.example` to `llmfrontend/.env.local`
2. Fill in your actual values for all services (Firebase, Stripe, Azure, etc.)

### Production Deployment
1. **Never commit `.env` files** - they are now in `.gitignore`
2. Use your deployment platform's environment variable management:
   - **Vercel**: Set environment variables in the dashboard
   - **Netlify**: Use environment variables in site settings
   - **Docker**: Use `--env-file` or Docker secrets
   - **Kubernetes**: Use ConfigMaps and Secrets

## 🔐 Critical Security Notes

### Immediate Actions Required
1. **Rotate all exposed secrets** that were previously hardcoded
2. **Update Stripe webhook endpoints** with new secrets
3. **Regenerate Firebase API keys** if they were exposed
4. **Update MongoDB connection strings** with new credentials

### Best Practices
1. **Use different secrets for development and production**
2. **Regularly rotate API keys and secrets**
3. **Use least privilege access** for all service accounts
4. **Monitor for unauthorized access** to your services
5. **Keep dependencies updated** to patch security vulnerabilities

### Environment Variable Security
- ✅ Use environment variables for all secrets
- ✅ Never log or expose environment variables
- ✅ Use different values for dev/staging/production
- ✅ Regularly rotate secrets
- ❌ Never commit `.env` files to version control
- ❌ Never hardcode secrets in source code

## 🛡️ Additional Security Recommendations

### 1. Certificate Management
- Store certificates securely (not in version control)
- Use certificate rotation policies
- Monitor certificate expiration

### 2. API Key Management
- Use service-specific API keys with minimal permissions
- Implement API key rotation schedules
- Monitor API usage for anomalies

### 3. Database Security
- Use connection pooling
- Implement proper authentication
- Enable encryption in transit and at rest
- Regular security audits

### 4. Webhook Security
- Validate webhook signatures
- Use HTTPS for all webhook endpoints
- Implement webhook retry logic with exponential backoff

## 📋 Checklist

- [ ] Copy environment templates and fill in actual values
- [ ] Rotate all previously exposed secrets
- [ ] Update deployment configurations
- [ ] Test all functionality with new environment variables
- [ ] Remove any remaining hardcoded secrets
- [ ] Set up monitoring for security events
- [ ] Document the new security setup for team members

## 🆘 Emergency Response

If you suspect a security breach:
1. **Immediately rotate all affected secrets**
2. **Review access logs** for unauthorized activity
3. **Update all API keys and tokens**
4. **Notify affected users** if necessary
5. **Document the incident** and lessons learned

## 📞 Support

For security-related questions or issues:
1. Review this documentation
2. Check the environment variable templates
3. Consult your deployment platform's security documentation
4. Contact your security team or DevOps lead 