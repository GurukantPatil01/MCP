# Crisp Health Assistant - Deployment Guide

This guide covers deploying the Crisp Health Assistant MVP with the MCP server on Fly.io and the frontend on Vercel.

## Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **MCP Server**: Node.js/Express server deployed on Fly.io
- **Database**: None (uses Google Health API directly)
- **AI**: OpenAI GPT-4 for health insights

## Prerequisites

1. **Accounts Setup**:
   - [Vercel account](https://vercel.com)
   - [Fly.io account](https://fly.io)
   - [Google Cloud Console account](https://console.cloud.google.com)
   - [OpenAI API account](https://platform.openai.com)

2. **CLI Tools**:
   ```bash
   npm install -g vercel
   brew install flyctl  # or curl -L https://fly.io/install.sh | sh
   ```

## Environment Variables

### Required Environment Variables

```bash
# Google Health/Fit API
GOOGLE_HEALTH_CLIENT_ID=your_google_client_id
GOOGLE_HEALTH_CLIENT_SECRET=your_google_client_secret

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# MCP Server
MCP_SERVER_URL=https://crisp-health-mcp-server.fly.dev
MCP_SERVER_PORT=3001

# Next.js
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_random_secret_string
```

## Google Cloud Setup

1. **Create a Google Cloud Project**:
   ```bash
   gcloud projects create crisp-health-assistant
   gcloud config set project crisp-health-assistant
   ```

2. **Enable APIs**:
   ```bash
   gcloud services enable fitness.googleapis.com
   gcloud services enable oauth2.googleapis.com
   ```

3. **Create OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client IDs
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-app.vercel.app/api/auth/callback/google` (production)

## Deployment Steps

### 1. Deploy MCP Server to Fly.io

```bash
# Navigate to MCP server directory
cd mcp-server

# Install Fly CLI and login
fly auth login

# Launch the app (interactive setup)
fly launch --name crisp-health-mcp-server

# Set environment variables
fly secrets set OPENAI_API_KEY="your_openai_api_key"
fly secrets set GOOGLE_HEALTH_CLIENT_ID="your_google_client_id"
fly secrets set GOOGLE_HEALTH_CLIENT_SECRET="your_google_client_secret"

# Deploy
fly deploy
```

### 2. Deploy Frontend to Vercel

```bash
# From root directory
vercel login

# Deploy (interactive setup)
vercel

# Set environment variables in Vercel Dashboard:
# https://vercel.com/your-username/crisp-health-assistant/settings/environment-variables

# Add production environment variables:
# - GOOGLE_HEALTH_CLIENT_ID
# - GOOGLE_HEALTH_CLIENT_SECRET
# - OPENAI_API_KEY
# - MCP_SERVER_URL
# - NEXTAUTH_URL
# - NEXTAUTH_SECRET
```

## Environment Variable Configuration

### Vercel Environment Variables

In your Vercel dashboard (Project Settings → Environment Variables):

| Name | Value | Environment |
|------|-------|-------------|
| `GOOGLE_HEALTH_CLIENT_ID` | Your Google OAuth client ID | Production, Preview, Development |
| `GOOGLE_HEALTH_CLIENT_SECRET` | Your Google OAuth client secret | Production, Preview, Development |
| `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
| `MCP_SERVER_URL` | `https://crisp-health-mcp-server.fly.dev` | Production, Preview |
| `MCP_SERVER_URL` | `http://localhost:3001` | Development |
| `NEXTAUTH_URL` | Your Vercel app URL | Production, Preview |
| `NEXTAUTH_SECRET` | Random secure string | Production, Preview, Development |

### Fly.io Environment Variables

```bash
# Set secrets in Fly.io
fly secrets set OPENAI_API_KEY="sk-..."
fly secrets set GOOGLE_HEALTH_CLIENT_ID="123456789..."
fly secrets set GOOGLE_HEALTH_CLIENT_SECRET="GOCSPX-..."
```

## Local Development

### 1. Start MCP Server

```bash
cd mcp-server
npm install
npm run dev  # Runs on http://localhost:3001
```

### 2. Start Frontend

```bash
# From root directory
npm install
npm run dev  # Runs on http://localhost:3000
```

## Verification

### MCP Server Health Check

```bash
curl https://crisp-health-mcp-server.fly.dev/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "server": "Crisp Health MCP Server",
  "version": "1.0.0"
}
```

### MCP Tools Info

```bash
curl https://crisp-health-mcp-server.fly.dev/mcp/info
```

### Frontend Health

Visit your Vercel deployment URL and verify:
- Dashboard loads properly
- Health metrics show (with mock data initially)
- Chat interface responds
- API routes work

## MCP Integration with Claude Desktop

To use the MCP server with Claude Desktop, add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "crisp-health": {
      "command": "node",
      "args": ["-e", "require('http').get('https://crisp-health-mcp-server.fly.dev/mcp/info', res => console.log('MCP Server Ready'))"],
      "env": {
        "MCP_SERVER_URL": "https://crisp-health-mcp-server.fly.dev"
      }
    }
  }
}
```

## Monitoring and Logs

### Fly.io Monitoring

```bash
# View logs
fly logs

# Monitor app status
fly status

# Check resource usage
fly machine list
```

### Vercel Monitoring

- Visit [Vercel Dashboard](https://vercel.com/dashboard)
- Check deployment status
- Review function logs
- Monitor performance metrics

## Troubleshooting

### Common Issues

1. **Google Health API 403/401 Errors**:
   - Verify OAuth credentials are correct
   - Check redirect URIs match exactly
   - Ensure Fitness API is enabled

2. **OpenAI API Errors**:
   - Verify API key is valid
   - Check rate limits and billing
   - Monitor token usage

3. **MCP Server Connection Issues**:
   - Check Fly.io app status: `fly status`
   - Verify environment variables: `fly secrets list`
   - Review logs: `fly logs`

4. **CORS Issues**:
   - Ensure frontend URL is in allowed origins
   - Check API route configurations

## Scaling Considerations

### Fly.io Scaling

```bash
# Scale MCP server
fly scale count 2
fly scale memory 1024
```

### Vercel Scaling

- Automatic scaling included
- Monitor function execution time
- Consider upgrading plan for higher limits

## Security

1. **Environment Variables**: Never commit secrets to git
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure properly for your domain
4. **Rate Limiting**: Implement for API protection
5. **Health Data**: Handle according to HIPAA/privacy requirements

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test API endpoints manually
4. Check service status pages
