import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { GoogleFitService } from './services/GoogleFitService';
import { OpenAIService } from './services/OpenAIService';
import { MCPHealthTools } from './tools/HealthTools';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.MCP_SERVER_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Services
const googleFitService = new GoogleFitService();
const openAIService = new OpenAIService();
const healthTools = new MCPHealthTools(googleFitService, openAIService);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'Crisp Health MCP Server',
    version: '1.0.0'
  });
});

// MCP Server info endpoint
app.get('/mcp/info', (req, res) => {
  res.json({
    name: 'Crisp Health Assistant MCP Server',
    version: '1.0.0',
    description: 'MCP server providing health data tools with Google Health integration',
    tools: [
      {
        name: 'get_health_data',
        description: 'Fetch latest health metrics from Google Health',
        inputSchema: {
          type: 'object',
          properties: {
            metric_type: {
              type: 'string',
              enum: ['steps', 'calories', 'heart_rate', 'sleep', 'weight', 'all'],
              default: 'all'
            },
            days: {
              type: 'number',
              default: 7,
              minimum: 1,
              maximum: 365
            }
          }
        }
      },
      {
        name: 'ask_health_question',
        description: 'Get AI-powered health insights using OpenAI',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string'
            },
            include_data: {
              type: 'boolean',
              default: true
            }
          },
          required: ['question']
        }
      },
      {
        name: 'get_health_summary',
        description: 'Generate daily/weekly health summary',
        inputSchema: {
          type: 'object',
          properties: {
            period: {
              type: 'string',
              enum: ['today', 'week', 'month'],
              default: 'week'
            }
          }
        }
      },
      {
        name: 'get_health_trends',
        description: 'Analyze health trends over time',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              default: 30,
              minimum: 7,
              maximum: 365
            }
          }
        }
      }
    ]
  });
});

// MCP Tool Endpoints

// Get health data tool
app.post('/mcp/health-data', async (req, res) => {
  try {
    const { metric_type = 'all', days = 7 } = req.body;
    const result = await healthTools.getHealthData(metric_type, days);
    res.json(result);
  } catch (error) {
    console.error('Health data tool error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Ask health question tool
app.post('/mcp/health-question', async (req, res) => {
  try {
    const { question, include_data = true } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const result = await healthTools.askHealthQuestion(question, include_data);
    res.json(result);
  } catch (error) {
    console.error('Health question tool error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Get health summary tool
app.post('/mcp/health-summary', async (req, res) => {
  try {
    const { period = 'week' } = req.body;
    const result = await healthTools.getHealthSummary(period);
    res.json(result);
  } catch (error) {
    console.error('Health summary tool error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Get health trends tool
app.post('/mcp/health-trends', async (req, res) => {
  try {
    const { days = 30 } = req.body;
    const result = await healthTools.getHealthTrends(days);
    res.json(result);
  } catch (error) {
    console.error('Health trends tool error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Crisp Health MCP Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔧 MCP info: http://localhost:${port}/mcp/info`);
  console.log(`🏥 Google Health integration: ${process.env.GOOGLE_HEALTH_CLIENT_ID ? '✅' : '❌'}`);
  console.log(`🤖 OpenAI integration: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Crisp Health MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating Crisp Health MCP Server...');
  process.exit(0);
});
