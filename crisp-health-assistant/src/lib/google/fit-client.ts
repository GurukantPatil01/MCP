import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { HealthMetric, HealthData, HealthPeriod } from '@/types/health';

interface GoogleFitBucket {
  dataset?: Array<{
    point?: Array<{
      startTimeNanos?: string;
      value?: Array<{
        intVal?: number;
        fpVal?: number;
      }>;
    }>;
  }>;
}

export class GoogleFitClient {
  private oauth2Client: OAuth2Client;
  private fitness: unknown;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_HEALTH_CLIENT_ID,
      process.env.GOOGLE_HEALTH_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    );

    this.fitness = google.fitness('v1');
  }

  setCredentials(tokens: { access_token: string; refresh_token?: string }) {
    this.oauth2Client.setCredentials(tokens);
    google.options({ auth: this.oauth2Client });
  }

  getAuthUrl(scopes: string[] = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.body.read'
  ]): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.setCredentials(tokens);
    return tokens;
  }

  private getTimeRange(days: number = 7): HealthPeriod {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - days);

    return {
      startTimeMillis: startTime.getTime().toString(),
      endTimeMillis: endTime.getTime().toString()
    };
  }

  async getStepsData(days: number = 7): Promise<HealthMetric[]> {
    const timeRange = this.getTimeRange(days);

    try {
      const response = await this.fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
          startTimeMillis: timeRange.startTimeMillis,
          endTimeMillis: timeRange.endTimeMillis
        }
      });

      return this.parseMetricData(response.data.bucket, 'steps', 'steps');
    } catch (error) {
      console.error('Error fetching steps data:', error);
      return [];
    }
  }

  async getCaloriesData(days: number = 7): Promise<HealthMetric[]> {
    const timeRange = this.getTimeRange(days);

    try {
      const response = await this.fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.calories.expended',
            dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: timeRange.startTimeMillis,
          endTimeMillis: timeRange.endTimeMillis
        }
      });

      return this.parseMetricData(response.data.bucket, 'calories', 'kcal');
    } catch (error) {
      console.error('Error fetching calories data:', error);
      return [];
    }
  }

  async getHeartRateData(days: number = 7): Promise<HealthMetric[]> {
    const timeRange = this.getTimeRange(days);

    try {
      const response = await this.fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.heart_rate.bpm'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: timeRange.startTimeMillis,
          endTimeMillis: timeRange.endTimeMillis
        }
      });

      return this.parseMetricData(response.data.bucket, 'heart_rate', 'bpm');
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
      return [];
    }
  }

  async getSleepData(days: number = 7): Promise<HealthMetric[]> {
    const timeRange = this.getTimeRange(days);

    try {
      const response = await this.fitness.users.sessions.list({
        userId: 'me',
        startTime: new Date(parseInt(timeRange.startTimeMillis)).toISOString(),
        endTime: new Date(parseInt(timeRange.endTimeMillis)).toISOString()
      });

      const sleepSessions = response.data.session?.filter(session => 
        session.activityType === 72 // Sleep activity type
      ) || [];

      return sleepSessions.map(session => {
        const startTime = new Date(session.startTimeMillis!);
        const endTime = new Date(session.endTimeMillis!);
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        return {
          type: 'sleep' as const,
          value: durationHours,
          unit: 'hours',
          timestamp: startTime,
          date: startTime.toISOString().split('T')[0]
        };
      });
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      return [];
    }
  }

  async getWeightData(days: number = 7): Promise<HealthMetric[]> {
    const timeRange = this.getTimeRange(days);

    try {
      const response = await this.fitness.users.dataSources.dataPointChanges.list({
        userId: 'me',
        dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight'
      });

      const dataPoints = response.data.insertedDataPoint || [];
      
      return dataPoints
        .filter(point => {
          const timestamp = parseInt(point.startTimeNanos!) / 1000000;
          return timestamp >= parseInt(timeRange.startTimeMillis) && 
                 timestamp <= parseInt(timeRange.endTimeMillis);
        })
        .map(point => {
          const timestamp = new Date(parseInt(point.startTimeNanos!) / 1000000);
          return {
            type: 'weight' as const,
            value: point.value![0].fpVal!,
            unit: 'kg',
            timestamp,
            date: timestamp.toISOString().split('T')[0]
          };
        });
    } catch (error) {
      console.error('Error fetching weight data:', error);
      return [];
    }
  }

  async getAllHealthData(days: number = 7): Promise<HealthData> {
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

  private parseMetricData(buckets: GoogleFitBucket[], type: string, unit: string): HealthMetric[] {
    if (!buckets) return [];

    return buckets
      .filter((bucket) => bucket.dataset?.[0]?.point?.length && bucket.dataset[0].point.length > 0)
      .map((bucket) => {
        const point = bucket.dataset[0].point[0];
        const timestamp = new Date(parseInt(point.startTimeNanos) / 1000000);
        
        let value = 0;
        if (point.value?.[0]?.intVal !== undefined) {
          value = point.value[0].intVal;
        } else if (point.value?.[0]?.fpVal !== undefined) {
          value = point.value[0].fpVal;
        }

        return {
          type: type as 'steps' | 'calories' | 'heart_rate' | 'sleep' | 'weight',
          value,
          unit,
          timestamp,
          date: timestamp.toISOString().split('T')[0]
        };
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
