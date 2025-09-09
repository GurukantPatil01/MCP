# 🏥 Crisp Health Assistant MVP

A minimalist health dashboard that integrates Google Health data with MCP (Model Context Protocol) server architecture and OpenAI for intelligent health Q&A.

## ✨ Features

- 📊 **Real-time Health Metrics**: Steps, calories, heart rate, sleep, and weight tracking
- 🤖 **AI-Powered Q&A**: Ask natural language questions about your health data
- 🔄 **MCP Server Integration**: Compatible with Claude Desktop and other MCP clients
- 📱 **Mobile-First Design**: Beautiful, responsive interface with smooth animations
- 🎯 **Lightning Fast**: Sub-2 second load times with optimized performance
- 🔒 **Privacy-Focused**: No database storage, direct Google Health integration

## 🏗️ Architecture

```
Google Health API → MCP Server (Fly.io) → OpenAI Analysis → Dashboard (Vercel)
                         ↓
                  AI Q&A via MCP Tools
```

### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **MCP Server**: Node.js + Express + TypeScript (Deployed on Fly.io)
- **AI Integration**: OpenAI GPT-4 for health insights
- **Data Source**: Google Health/Fit API
- **Hosting**: Vercel (frontend) + Fly.io (MCP server)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud Console account
- OpenAI API key

### 1. Clone and Install

```bash
git clone https://github.com/your-username/crisp-health-assistant.git
cd crisp-health-assistant
npm install

# Install MCP server dependencies
cd mcp-server
npm install
cd ..
```

### 2. Environment Setup

Copy `.env.local` and update with your credentials:

```bash
# Google Health API
GOOGLE_HEALTH_CLIENT_ID=your_google_client_id
GOOGLE_HEALTH_CLIENT_SECRET=your_google_client_secret

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# MCP Server
MCP_SERVER_URL=http://localhost:3001
MCP_SERVER_PORT=3001

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

### 3. Run the Application

```bash
# Terminal 1: Start MCP Server
cd mcp-server
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

Visit `http://localhost:3000` to see the dashboard!

## 🎯 Core MCP Tools

1. **`get_health_data`** - Fetch health metrics from Google Health
2. **`ask_health_question`** - AI-powered health Q&A with context
3. **`get_health_summary`** - Generate AI health summaries
4. **`get_health_trends`** - Analyze health trends over time

## 🔌 MCP Integration with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "crisp-health": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "GOOGLE_HEALTH_CLIENT_ID": "your-id"
      }
    }
  }
}
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

- **Frontend**: Deploy to Vercel
- **MCP Server**: Deploy to Fly.io
- **Environment**: Configure secrets in both platforms

## 📊 Performance Targets

- Dashboard loads in < 2 seconds
- MCP API response time < 150ms
- 99.9% uptime
- Mobile-first responsive design

## 🤝 Support

For deployment and usage questions, check:
1. [DEPLOYMENT.md](./DEPLOYMENT.md) for setup instructions
2. Environment variable configuration
3. API endpoint testing

---

<div align="center">
  <strong>Built with ❤️ for better health tracking</strong>
</div>
