import OpenAI from 'openai';
import { HealthData, HealthInsight } from '@/types/health';

export class HealthQAClient {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async askHealthQuestion(question: string, healthData?: HealthData): Promise<string> {
    const systemPrompt = `You are a knowledgeable health assistant. You provide helpful, accurate health insights based on user data. Always:
    - Give personalized responses when data is available
    - Be encouraging and positive
    - Suggest actionable improvements
    - Never give medical diagnosis or replace professional medical advice
    - Keep responses concise but informative
    - Focus on trends and patterns in the data`;

    let userPrompt = `Question: ${question}`;

    if (healthData) {
      const dataContext = this.formatHealthDataForAI(healthData);
      userPrompt += `\n\nUser's Recent Health Data:\n${dataContext}`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'Sorry, I could not process your question at the moment.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'I apologize, but I\'m having trouble processing your question right now. Please try again later.';
    }
  }

  async generateHealthSummary(healthData: HealthData, period: 'today' | 'week' | 'month'): Promise<string> {
    const dataContext = this.formatHealthDataForAI(healthData);
    const periodText = period === 'today' ? 'today' : `this ${period}`;

    const prompt = `Based on the following health data, provide a concise summary of the user's health status for ${periodText}. Include key highlights, improvements, and gentle suggestions:

    ${dataContext}

    Please provide:
    1. Overall assessment
    2. Key highlights (2-3 points)
    3. One actionable suggestion for improvement
    
    Keep it positive, encouraging, and under 150 words.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.6
      });

      return response.choices[0].message.content || 'Unable to generate summary at this time.';
    } catch (error) {
      console.error('OpenAI summary error:', error);
      return 'Unable to generate health summary at this time.';
    }
  }

  async generateHealthInsights(healthData: HealthData): Promise<HealthInsight[]> {
    const dataContext = this.formatHealthDataForAI(healthData);

    const prompt = `Based on this health data, generate 2-3 actionable health insights. Focus on trends, achievements, or areas for improvement:

    ${dataContext}

    For each insight, provide:
    - Type: tip, trend, achievement, or warning
    - Title: Short, engaging title
    - Description: Brief, actionable description
    
    Return as JSON array with format: [{"type": "tip", "title": "...", "description": "..."}]`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      if (!content) return [];

      try {
        const insights = JSON.parse(content);
        return insights.map((insight: {
          type: string;
          title: string;
          description: string;
        }, index: number) => ({
          id: `insight-${Date.now()}-${index}`,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          timestamp: new Date()
        }));
      } catch (parseError) {
        console.error('Failed to parse insights JSON:', parseError);
        return [];
      }
    } catch (error) {
      console.error('OpenAI insights error:', error);
      return [];
    }
  }

  private formatHealthDataForAI(healthData: HealthData): string {
    const latest = this.getLatestMetrics(healthData);
    const trends = this.calculateSimpleTrends(healthData);

    return `Recent Health Metrics:
    - Steps: ${latest.steps} (daily average: ${trends.avgSteps})
    - Calories: ${latest.calories} kcal (daily average: ${trends.avgCalories})
    - Heart Rate: ${latest.heartRate} bpm (daily average: ${trends.avgHeartRate})
    - Sleep: ${latest.sleep} hours (daily average: ${trends.avgSleep})
    - Weight: ${latest.weight} kg (latest available)
    
    Data covers ${healthData.steps.length} days, last synced: ${healthData.lastSync.toLocaleDateString()}`;
  }

  private getLatestMetrics(healthData: HealthData) {
    return {
      steps: healthData.steps[healthData.steps.length - 1]?.value || 0,
      calories: healthData.calories[healthData.calories.length - 1]?.value || 0,
      heartRate: healthData.heart_rate[healthData.heart_rate.length - 1]?.value || 0,
      sleep: healthData.sleep[healthData.sleep.length - 1]?.value || 0,
      weight: healthData.weight[healthData.weight.length - 1]?.value || 0
    };
  }

  private calculateSimpleTrends(healthData: HealthData) {
    const avgSteps = Math.round(
      healthData.steps.reduce((sum, m) => sum + m.value, 0) / healthData.steps.length || 0
    );
    const avgCalories = Math.round(
      healthData.calories.reduce((sum, m) => sum + m.value, 0) / healthData.calories.length || 0
    );
    const avgHeartRate = Math.round(
      healthData.heart_rate.reduce((sum, m) => sum + m.value, 0) / healthData.heart_rate.length || 0
    );
    const avgSleep = Math.round(
      (healthData.sleep.reduce((sum, m) => sum + m.value, 0) / healthData.sleep.length || 0) * 10
    ) / 10;

    return { avgSteps, avgCalories, avgHeartRate, avgSleep };
  }

  async analyzeHealthTrends(currentData: HealthData, previousData?: HealthData): Promise<string> {
    if (!previousData) {
      return 'Not enough historical data for trend analysis. Keep tracking for better insights!';
    }

    const currentAvg = this.calculateSimpleTrends(currentData);
    const previousAvg = this.calculateSimpleTrends(previousData);

    const changes = {
      steps: currentAvg.avgSteps - previousAvg.avgSteps,
      calories: currentAvg.avgCalories - previousAvg.avgCalories,
      heartRate: currentAvg.avgHeartRate - previousAvg.avgHeartRate,
      sleep: currentAvg.avgSleep - previousAvg.avgSleep
    };

    const prompt = `Analyze these health trends and provide encouraging insights:

    Changes from previous period:
    - Steps: ${changes.steps > 0 ? '+' : ''}${changes.steps}
    - Calories: ${changes.calories > 0 ? '+' : ''}${changes.calories} kcal
    - Heart Rate: ${changes.heartRate > 0 ? '+' : ''}${changes.heartRate} bpm
    - Sleep: ${changes.sleep > 0 ? '+' : ''}${changes.sleep} hours

    Provide a brief, positive analysis focusing on progress and motivation.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'Keep up the great work with your health tracking!';
    } catch (error) {
      console.error('Trend analysis error:', error);
      return 'Unable to analyze trends at this time, but keep up the great work!';
    }
  }
}
