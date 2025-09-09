import { HealthMetric, HealthData } from '../types/health';
export declare class GoogleFitService {
    private oauth2Client;
    private fitness;
    constructor();
    setCredentials(tokens: {
        access_token: string;
        refresh_token?: string;
    }): void;
    private getTimeRange;
    getStepsData(days?: number): Promise<HealthMetric[]>;
    getCaloriesData(days?: number): Promise<HealthMetric[]>;
    getHeartRateData(days?: number): Promise<HealthMetric[]>;
    getSleepData(days?: number): Promise<HealthMetric[]>;
    getWeightData(days?: number): Promise<HealthMetric[]>;
    getAllHealthData(days?: number): Promise<HealthData>;
    private parseMetricData;
    private generateMockData;
}
//# sourceMappingURL=GoogleFitService.d.ts.map