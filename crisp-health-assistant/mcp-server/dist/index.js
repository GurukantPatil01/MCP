"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const GoogleFitService_1 = require("./services/GoogleFitService");
const OpenAIService_1 = require("./services/OpenAIService");
const HealthTools_1 = require("./tools/HealthTools");
const MealTools_1 = require("./tools/MealTools");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.MCP_SERVER_PORT || '3001');
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// Services
const googleFitService = new GoogleFitService_1.GoogleFitService();
const openAIService = new OpenAIService_1.OpenAIService();
const healthTools = new HealthTools_1.MCPHealthTools(googleFitService, openAIService);
const mealTools = new MealTools_1.MealTools(openAIService);
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
            },
            {
                name: 'get_meal_recommendations',
                description: 'Get personalized meal suggestions based on user preferences and health data',
                inputSchema: {
                    type: 'object',
                    properties: {
                        meal_type: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
                        max_prep_time: { type: 'number' },
                        dietary_restrictions: { type: 'array', items: { type: 'string' } },
                        calorie_range: { type: 'string', enum: ['low', 'medium', 'high'] },
                        activity_level: { type: 'string' }
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Health trends tool error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
// Get meal recommendations tool
app.post('/mcp/meal-recommendations', async (req, res) => {
    try {
        const { meal_type, max_prep_time, dietary_restrictions, calorie_range, activity_level } = req.body;
        const result = await mealTools.getMealRecommendations({
            meal_type,
            max_prep_time,
            dietary_restrictions,
            calorie_range,
            activity_level,
        });
        res.json(result);
    }
    catch (error) {
        console.error('Meal recommendations tool error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
// Error handling middleware
app.use((error, req, res, next) => {
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
app.listen(port, 'localhost', () => {
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
//# sourceMappingURL=index.js.map