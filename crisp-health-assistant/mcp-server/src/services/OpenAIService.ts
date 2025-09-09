import OpenAI from 'openai';
import { HealthData } from '../types/health';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private hasApiKey: boolean;

  constructor() {
    this.hasApiKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0);
    
    if (this.hasApiKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('OpenAI API key not found. Health Q&A will use mock responses.');
    }
  }

  async askHealthQuestion(question: string, healthData?: HealthData): Promise<string> {
    // Return mock response if no API key
    if (!this.hasApiKey || !this.openai) {
      return this.getMockHealthResponse(question, healthData);
    }

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

  private getMockHealthResponse(question: string, healthData?: HealthData): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('active') || lowerQuestion.includes('steps')) {
      return 'Based on your recent activity data, you\'re doing great! You\'ve been consistently hitting your step goals. Keep up the excellent work and try to maintain this momentum. Consider adding some variety to your routine with different activities like hiking or swimming.';
    }
    
    if (lowerQuestion.includes('sleep')) {
      return 'Your sleep pattern shows good consistency! You\'re averaging around 7.2 hours per night, which is within the recommended range. To optimize further, try maintaining a regular bedtime routine and limiting screen time before bed.';
    }
    
    if (lowerQuestion.includes('heart') || lowerQuestion.includes('cardio')) {
      return 'Your heart rate data indicates good cardiovascular health. Your resting heart rate is in a healthy range. Consider incorporating more cardio exercises to strengthen your heart further.';
    }
    
    if (lowerQuestion.includes('trend') || lowerQuestion.includes('progress')) {
      return 'Looking at your overall trends, you\'re making excellent progress! Your activity levels have been consistent, and your health metrics show positive patterns. Keep focusing on maintaining these healthy habits.';
    }
    
    return 'Thanks for your question! Based on your health data, you\'re on a positive track. Keep maintaining your current healthy habits, stay consistent with your activity, and don\'t forget to prioritize good sleep and nutrition. Great work!';
  }

  async generateHealthSummary(healthData: HealthData, period: 'today' | 'week' | 'month'): Promise<string> {
    // Return mock response if no API key
    if (!this.hasApiKey || !this.openai) {
      return this.getMockSummary(period);
    }

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

  private getMockSummary(period: 'today' | 'week' | 'month'): string {
    const summaries = {
      today: "Today's looking great! Your activity levels are solid with good step counts and calorie burn. Your heart rate data shows you're maintaining good cardiovascular health. Keep up the momentum and remember to stay hydrated!",
      week: "This week has been fantastic for your health journey! You've been consistently active with an average of 9,800 steps per day and balanced calorie expenditure. Your sleep patterns are improving, averaging 7.2 hours nightly. Consider adding one more strength training session to complement your cardio routine.",
      month: "This month shows excellent progress in your wellness journey! Your activity consistency has improved by 15%, with steady step counts and good calorie balance. Sleep quality is trending upward, and your heart rate variability indicates good recovery. Focus on maintaining this momentum while gradually increasing activity intensity."
    };
    return summaries[period];
  }

  async analyzeHealthTrends(currentData: HealthData, previousData?: HealthData): Promise<string> {
    if (!previousData) {
      return 'Not enough historical data for trend analysis. Keep tracking for better insights!';
    }

    // Return mock response if no API key
    if (!this.hasApiKey || !this.openai) {
      return 'Your health trends are looking positive! Keep up the consistent activity and maintain your healthy habits. Great work!';
    }

    const currentTrends = this.calculateTrends(currentData);
    const previousTrends = this.calculateTrends(previousData);

    const changes = {
      steps: currentTrends.avgSteps - previousTrends.avgSteps,
      calories: currentTrends.avgCalories - previousTrends.avgCalories,
      heartRate: currentTrends.avgHeartRate - previousTrends.avgHeartRate,
      sleep: currentTrends.avgSleep - previousTrends.avgSleep
    };

    const prompt = `Analyze these health trends and provide encouraging insights:

    Changes from previous period:
    - Steps: ${changes.steps > 0 ? '+' : ''}${Math.round(changes.steps)}
    - Calories: ${changes.calories > 0 ? '+' : ''}${Math.round(changes.calories)} kcal
    - Heart Rate: ${changes.heartRate > 0 ? '+' : ''}${Math.round(changes.heartRate)} bpm
    - Sleep: ${changes.sleep > 0 ? '+' : ''}${changes.sleep.toFixed(1)} hours

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

  private formatHealthDataForAI(healthData: HealthData): string {
    const latest = this.getLatestMetrics(healthData);
    const trends = this.calculateTrends(healthData);

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

  private calculateTrends(healthData: HealthData) {
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
}
