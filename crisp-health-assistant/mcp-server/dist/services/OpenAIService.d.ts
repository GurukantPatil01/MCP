import { HealthData } from '../types/health';
export declare class OpenAIService {
    private openai;
    private hasApiKey;
    constructor();
    askHealthQuestion(question: string, healthData?: HealthData): Promise<string>;
    private getMockHealthResponse;
    generateHealthSummary(healthData: HealthData, period: 'today' | 'week' | 'month'): Promise<string>;
    private getMockSummary;
    analyzeHealthTrends(currentData: HealthData, previousData?: HealthData): Promise<string>;
    private formatHealthDataForAI;
    private getLatestMetrics;
    private calculateTrends;
    generateText(prompt: string): Promise<string>;
}
//# sourceMappingURL=OpenAIService.d.ts.map