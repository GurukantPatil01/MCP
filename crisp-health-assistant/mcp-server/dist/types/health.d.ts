export interface HealthMetric {
    type: 'steps' | 'calories' | 'heart_rate' | 'sleep' | 'weight';
    value: number;
    unit: string;
    timestamp: Date;
    date: string;
}
export interface HealthData {
    steps: HealthMetric[];
    calories: HealthMetric[];
    heart_rate: HealthMetric[];
    sleep: HealthMetric[];
    weight: HealthMetric[];
    lastSync: Date;
}
export interface MCPToolResult {
    success: boolean;
    data?: any;
    error?: string;
    timestamp: Date;
}
export interface HealthSummary {
    period: 'today' | 'week' | 'month';
    summary: string;
    insights: string[];
    timestamp: Date;
}
//# sourceMappingURL=health.d.ts.map