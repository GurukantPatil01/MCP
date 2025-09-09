# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Frontend (Next.js)
```bash
# Development server with Turbopack for fast builds
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### MCP Server
```bash
# Navigate to MCP server directory
cd mcp-server

# Development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Clean build artifacts
npm run clean
```

### Full Stack Development
```bash
# Terminal 1: Start MCP Server
cd mcp-server && npm run dev

# Terminal 2: Start Frontend
npm run dev
```

### Testing and Verification
```bash
# Check MCP server health
curl http://localhost:3001/health

# Check MCP server tools info
curl http://localhost:3001/mcp/info

# Test ESLint configuration
npm run lint
```

## Architecture Overview

This is a **health dashboard application** built with a unique **MCP (Model Context Protocol) server architecture** that integrates Google Health data with AI-powered insights.

### Core Architecture Pattern
```
Google Health API → MCP Server (Express/Node.js) → Frontend (Next.js)
                         ↓
                  OpenAI GPT-4 Analysis
```

### Two-Service Architecture
1. **Frontend Service**: Next.js 15 application deployed on Vercel
2. **MCP Server**: Express.js API server deployed on Fly.io

### Key Integration Points
- **MCP Server**: Serves as middleware between frontend and external APIs
- **Google Health Integration**: Direct API calls via `googleapis` package
- **OpenAI Integration**: Health data analysis and Q&A capabilities
- **Clerk Authentication**: User management and authentication
- **Real-time Communication**: Frontend communicates with MCP server via REST API

## Project Structure

### Frontend (`src/`)
- `app/` - Next.js 15 App Router structure
  - `dashboard/` - Protected dashboard route
  - `sign-in/`, `sign-up/` - Clerk authentication routes
- `components/` - React components
  - `health/` - Health-specific components (dashboard, metrics, chat)
  - `ui/` - shadcn/ui components
- `lib/` - Utility libraries
  - `mcp/client.ts` - MCP server communication client
  - `google/` - Google Health API integration
  - `openai/` - AI health analysis utilities
- `types/health.ts` - TypeScript interfaces for health data

### MCP Server (`mcp-server/`)
- `src/index.ts` - Express server with MCP tool endpoints
- `src/services/` - Google Fit and OpenAI service classes
- `src/tools/` - MCP health tools implementation
- `dist/` - Compiled TypeScript output
- `Dockerfile` - Multi-stage Docker build for Fly.io deployment

## Key Technologies

### Frontend Stack
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Static typing throughout
- **Tailwind CSS 4**: Utility-first styling
- **Framer Motion**: Animations and transitions
- **GSAP**: Advanced animations and scroll triggers
- **shadcn/ui**: Component library
- **Clerk**: Authentication and user management

### MCP Server Stack
- **Express.js**: REST API server
- **TypeScript**: Full type safety
- **Google APIs**: Health/Fit data integration
- **OpenAI**: GPT-4 for health insights
- **Security**: Helmet, CORS, compression middleware

### Deployment Infrastructure
- **Vercel**: Frontend hosting with edge functions
- **Fly.io**: MCP server hosting with auto-scaling
- **Docker**: Containerized MCP server deployment

## MCP Server Details

### Available Tools
1. **`get_health_data`** - Fetch health metrics from Google Health
   - Parameters: `metric_type` (steps|calories|heart_rate|sleep|weight|all), `days` (1-365)
   
2. **`ask_health_question`** - AI-powered health Q&A
   - Parameters: `question` (string), `include_data` (boolean)
   
3. **`get_health_summary`** - Generate health summaries
   - Parameters: `period` (today|week|month)
   
4. **`get_health_trends`** - Analyze health trends
   - Parameters: `days` (7-365)

### MCP Server Endpoints
- `GET /health` - Health check endpoint
- `GET /mcp/info` - Server and tools information
- `POST /mcp/health-data` - Execute health data tool
- `POST /mcp/health-question` - Execute health Q&A tool
- `POST /mcp/health-summary` - Execute health summary tool
- `POST /mcp/health-trends` - Execute health trends tool

## Environment Configuration

### Required Environment Variables
```bash
# Google Health/Fit API
GOOGLE_HEALTH_CLIENT_ID=your_google_client_id
GOOGLE_HEALTH_CLIENT_SECRET=your_google_client_secret

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# MCP Server Configuration
MCP_SERVER_URL=http://localhost:3001  # Development
MCP_SERVER_PORT=3001

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

## Development Patterns

### Authentication Flow
1. **Clerk** handles all user authentication and session management
2. **Protected routes** use Clerk's `useUser` hook for access control
3. **Sign-in/Sign-up** flows are handled by Clerk components

### Data Flow Pattern
1. **Frontend** makes requests to `/api/` routes (Next.js API routes)
2. **API routes** communicate with MCP server using `mcpClient`
3. **MCP server** processes requests and calls Google Health/OpenAI APIs
4. **Response** flows back through the chain with proper error handling

### Component Architecture
- **Health Dashboard**: Main container component managing state
- **Health Metrics**: Individual metric cards with progress indicators
- **Health Chat**: AI-powered Q&A interface
- **MCP Client**: Centralized API communication layer

### TypeScript Patterns
- **Strict typing** enabled throughout the project
- **Health data interfaces** defined in `types/health.ts`
- **API response types** for consistent data structures

## Deployment Considerations

### MCP Server (Fly.io)
- **Multi-stage Docker build** for optimized image size
- **Health checks** configured for automatic restarts
- **Auto-scaling** between 1-3 machines based on load
- **Environment secrets** managed via Fly.io secrets

### Frontend (Vercel)
- **Turbopack** enabled for faster builds
- **Edge functions** for API routes with 30s timeout
- **Environment variables** configured in Vercel dashboard
- **Regional deployment** optimized for performance

## Working with Health Data

### Google Health API Integration
- **OAuth 2.0 flow** for user consent and data access
- **Fitness API** for steps, calories, heart rate, sleep data
- **Data aggregation** by day for dashboard display
- **Real-time sync** capabilities with refresh functionality

### AI Integration Patterns
- **Contextual health analysis** using current user data
- **Natural language Q&A** about health metrics and trends
- **Personalized insights** based on individual health patterns
- **Trend analysis** over configurable time periods

## Performance Considerations

- **Sub-2 second** dashboard load times target
- **MCP API response** under 150ms target
- **Lazy loading** for non-critical components
- **Optimized animations** with GSAP and Framer Motion
- **Efficient data fetching** with proper caching strategies

## Troubleshooting Common Issues

### MCP Server Connection
```bash
# Check if MCP server is running
curl http://localhost:3001/health

# View MCP server logs
cd mcp-server && npm run dev
```

### Google Health API Issues
- Verify OAuth credentials in Google Cloud Console
- Check redirect URIs match exactly
- Ensure Fitness API is enabled

### Build Issues
- Clear `.next` directory for frontend issues
- Clear `mcp-server/dist` directory for server issues
- Verify all environment variables are set correctly
