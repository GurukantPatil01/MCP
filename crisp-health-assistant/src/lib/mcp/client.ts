import { MCPToolResponse } from '@/types/health';

export class MCPHealthClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.MCP_SERVER_URL || 'http://localhost:3001';
  }

  async getHealthData(metricType: string = 'all', days: number = 7): Promise<MCPToolResponse> {
    return this.callTool('get_health_data', {
      metric_type: metricType,
      days
    });
  }

  async askHealthQuestion(question: string, includeData: boolean = true): Promise<MCPToolResponse> {
    return this.callTool('ask_health_question', {
      question,
      include_data: includeData
    });
  }

  async getHealthSummary(period: 'today' | 'week' | 'month' = 'week'): Promise<MCPToolResponse> {
    return this.callTool('get_health_summary', {
      period
    });
  }

  async getHealthTrends(days: number = 30): Promise<MCPToolResponse> {
    return this.callTool('get_health_trends', {
      days
    });
  }

  private async callTool(tool: string, params: Record<string, unknown>): Promise<MCPToolResponse> {
    try {
      // Map tool names to correct endpoints
      const endpointMap: Record<string, string> = {
        'get_health_data': 'health-data',
        'ask_health_question': 'health-question', 
        'get_health_summary': 'health-summary',
        'get_health_trends': 'health-trends'
      };
      
      const endpoint = endpointMap[tool] || tool;
      const response = await fetch(`${this.baseUrl}/mcp/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // The MCP server already returns {success, data, timestamp} structure
      if (result.success) {
        return {
          success: true,
          data: result.data,
          timestamp: result.timestamp ? new Date(result.timestamp) : new Date()
        };
      } else {
        return {
          success: false,
          error: result.error || 'Unknown error from MCP server',
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error(`MCP tool ${tool} error:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // Health check for MCP server
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      } as RequestInit);

      return response.ok;
    } catch (error) {
      console.error('MCP server health check failed:', error);
      return false;
    }
  }

  // Get MCP server info and available tools
  async getServerInfo(): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/info`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get MCP server info:', error);
      return null;
    }
  }
}

// Singleton instance for use across the app
export const mcpClient = new MCPHealthClient();
