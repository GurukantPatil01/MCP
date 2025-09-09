"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFitService = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
class GoogleFitService {
    constructor() {
        this.oauth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_HEALTH_CLIENT_ID, process.env.GOOGLE_HEALTH_CLIENT_SECRET);
        this.fitness = googleapis_1.google.fitness('v1');
        googleapis_1.google.options({ auth: this.oauth2Client });
    }
    setCredentials(tokens) {
        this.oauth2Client.setCredentials(tokens);
    }
    getTimeRange(days = 7) {
        const endTime = new Date();
        const startTime = new Date();
        startTime.setDate(startTime.getDate() - days);
        return {
            startTimeMillis: startTime.getTime().toString(),
            endTimeMillis: endTime.getTime().toString()
        };
    }
    async getStepsData(days = 7) {
        // For development, always return mock data
        console.log(`Generating mock steps data for ${days} days`);
        return this.generateMockData('steps', 'steps', days, 8000, 12000);
    }
    async getCaloriesData(days = 7) {
        // For development, always return mock data
        console.log(`Generating mock calories data for ${days} days`);
        return this.generateMockData('calories', 'kcal', days, 1800, 2200);
    }
    async getHeartRateData(days = 7) {
        // For development, always return mock data
        console.log(`Generating mock heart rate data for ${days} days`);
        return this.generateMockData('heart_rate', 'bpm', days, 65, 85);
    }
    async getSleepData(days = 7) {
        // For development, always return mock data
        console.log(`Generating mock sleep data for ${days} days`);
        return this.generateMockData('sleep', 'hours', days, 6.5, 8.5);
    }
    async getWeightData(days = 7) {
        // For development, always return mock data
        console.log(`Generating mock weight data for ${days} days`);
        return this.generateMockData('weight', 'kg', days, 70, 75);
    }
    async getAllHealthData(days = 7) {
        const [steps, calories, heartRate, sleep, weight] = await Promise.all([
            this.getStepsData(days),
            this.getCaloriesData(days),
            this.getHeartRateData(days),
            this.getSleepData(days),
            this.getWeightData(days)
        ]);
        return {
            steps,
            calories,
            heart_rate: heartRate,
            sleep,
            weight,
            lastSync: new Date()
        };
    }
    parseMetricData(buckets, type, unit) {
        if (!buckets || buckets.length === 0) {
            // Generate mock data if no real data available
            return this.generateMockData(type, unit, 7, 1000, 15000);
        }
        return buckets
            .filter(bucket => bucket.dataset?.[0]?.point?.length > 0)
            .map(bucket => {
            const point = bucket.dataset[0].point[0];
            const timestamp = new Date(parseInt(point.startTimeNanos) / 1000000);
            let value = 0;
            if (point.value?.[0]?.intVal !== undefined) {
                value = point.value[0].intVal;
            }
            else if (point.value?.[0]?.fpVal !== undefined) {
                value = point.value[0].fpVal;
            }
            return {
                type: type,
                value,
                unit,
                timestamp,
                date: timestamp.toISOString().split('T')[0]
            };
        })
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    // Generate mock data for development/testing
    generateMockData(type, unit, days, min, max) {
        const data = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            let value;
            if (type === 'sleep') {
                // Sleep should be reasonable hours
                value = Math.random() * (max - min) + min;
                value = Math.round(value * 10) / 10; // One decimal place
            }
            else if (type === 'weight') {
                // Weight should be stable with small variations
                const baseWeight = (min + max) / 2;
                value = baseWeight + (Math.random() - 0.5) * 2;
                value = Math.round(value * 10) / 10;
            }
            else {
                value = Math.floor(Math.random() * (max - min) + min);
            }
            data.push({
                type,
                value,
                unit,
                timestamp: date,
                date: date.toISOString().split('T')[0]
            });
        }
        return data;
    }
}
exports.GoogleFitService = GoogleFitService;
//# sourceMappingURL=GoogleFitService.js.map