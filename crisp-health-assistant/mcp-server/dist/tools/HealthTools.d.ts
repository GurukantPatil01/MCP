import { GoogleFitService } from '../services/GoogleFitService';
import { OpenAIService } from '../services/OpenAIService';
import { MCPToolResult } from '../types/health';
export declare class MCPHealthTools {
    private googleFitService;
    private openAIService;
    constructor(googleFitService: GoogleFitService, openAIService: OpenAIService);
    getHealthData(metricType?: string, days?: number): Promise<MCPToolResult>;
    askHealthQuestion(question: string, includeData?: boolean): Promise<MCPToolResult>;
    getHealthSummary(period?: 'today' | 'week' | 'month'): Promise<MCPToolResult>;
    getHealthTrends(days?: number): Promise<MCPToolResult>;
    private calculateAverages;
    private calculateTotals;
}
//# sourceMappingURL=HealthTools.d.ts.map