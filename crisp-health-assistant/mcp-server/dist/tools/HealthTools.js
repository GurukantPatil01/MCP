"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPHealthTools = void 0;
class MCPHealthTools {
    constructor(googleFitService, openAIService) {
        this.googleFitService = googleFitService;
        this.openAIService = openAIService;
    }
    async getHealthData(metricType = 'all', days = 7) {
        try {
            let data;
            switch (metricType) {
                case 'steps':
                    data = await this.googleFitService.getStepsData(days);
                    break;
                case 'calories':
                    data = await this.googleFitService.getCaloriesData(days);
                    break;
                case 'heart_rate':
                    data = await this.googleFitService.getHeartRateData(days);
                    break;
                case 'sleep':
                    data = await this.googleFitService.getSleepData(days);
                    break;
                case 'weight':
                    data = await this.googleFitService.getWeightData(days);
                    break;
                case 'all':
                default:
                    data = await this.googleFitService.getAllHealthData(days);
                    break;
            }
            return {
                success: true,
                data,
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Get health data tool error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch health data',
                timestamp: new Date()
            };
        }
    }
    async askHealthQuestion(question, includeData = true) {
        try {
            let healthData;
            if (includeData) {
                try {
                    healthData = await this.googleFitService.getAllHealthData(7);
                }
                catch (error) {
                    console.warn('Could not fetch health data for question context:', error);
                    // Continue without health data
                }
            }
            const answer = await this.openAIService.askHealthQuestion(question, healthData);
            return {
                success: true,
                data: {
                    answer,
                    question,
                    healthDataIncluded: !!healthData
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Ask health question tool error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process health question',
                timestamp: new Date()
            };
        }
    }
    async getHealthSummary(period = 'week') {
        try {
            // Determine the number of days based on period
            let days;
            switch (period) {
                case 'today':
                    days = 1;
                    break;
                case 'week':
                    days = 7;
                    break;
                case 'month':
                    days = 30;
                    break;
                default:
                    days = 7;
            }
            const healthData = await this.googleFitService.getAllHealthData(days);
            const summary = await this.openAIService.generateHealthSummary(healthData, period);
            return {
                success: true,
                data: {
                    summary,
                    period,
                    healthData: {
                        totalDays: days,
                        metricsCount: {
                            steps: healthData.steps.length,
                            calories: healthData.calories.length,
                            heart_rate: healthData.heart_rate.length,
                            sleep: healthData.sleep.length,
                            weight: healthData.weight.length
                        }
                    }
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Get health summary tool error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate health summary',
                timestamp: new Date()
            };
        }
    }
    async getHealthTrends(days = 30) {
        try {
            // Get current period data
            const currentData = await this.googleFitService.getAllHealthData(days);
            // For trend analysis, we would need previous period data
            // For now, we'll provide basic trend analysis
            const trends = await this.openAIService.analyzeHealthTrends(currentData);
            // Calculate basic statistics
            const stats = {
                averages: this.calculateAverages(currentData),
                totals: this.calculateTotals(currentData),
                trends: {
                    analysis: trends,
                    period: `${days} days`,
                    dataPoints: currentData.steps.length
                }
            };
            return {
                success: true,
                data: {
                    trends: stats,
                    period: days,
                    healthData: currentData
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Get health trends tool error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze health trends',
                timestamp: new Date()
            };
        }
    }
    calculateAverages(healthData) {
        return {
            steps: Math.round(healthData.steps.reduce((sum, m) => sum + m.value, 0) / healthData.steps.length || 0),
            calories: Math.round(healthData.calories.reduce((sum, m) => sum + m.value, 0) / healthData.calories.length || 0),
            heartRate: Math.round(healthData.heart_rate.reduce((sum, m) => sum + m.value, 0) / healthData.heart_rate.length || 0),
            sleep: Math.round((healthData.sleep.reduce((sum, m) => sum + m.value, 0) / healthData.sleep.length || 0) * 10) / 10
        };
    }
    calculateTotals(healthData) {
        return {
            steps: healthData.steps.reduce((sum, m) => sum + m.value, 0),
            calories: healthData.calories.reduce((sum, m) => sum + m.value, 0),
            sleepHours: healthData.sleep.reduce((sum, m) => sum + m.value, 0)
        };
    }
}
exports.MCPHealthTools = MCPHealthTools;
//# sourceMappingURL=HealthTools.js.map