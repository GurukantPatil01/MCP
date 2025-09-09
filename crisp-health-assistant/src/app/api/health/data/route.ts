import { NextRequest, NextResponse } from 'next/server';
import { HealthData } from '@/types/health';

// Mock health data generator
function generateMockHealthData(days: number): HealthData {
  const data: HealthData = {
    steps: [],
    calories: [],
    heart_rate: [],
    sleep: [],
    weight: [],
    lastSync: new Date()
  };

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic mock data with some variation
    const baseSteps = 8000 + Math.random() * 4000; // 8k-12k steps
    const baseCalories = 1800 + Math.random() * 400; // 1800-2200 calories
    const baseHeartRate = 65 + Math.random() * 20; // 65-85 bpm
    const baseSleep = 6.5 + Math.random() * 2; // 6.5-8.5 hours
    const baseWeight = 70 + Math.random() * 10; // 70-80 kg

    data.steps.push({
      type: 'steps',
      value: Math.round(baseSteps),
      unit: 'steps',
      timestamp: date,
      date: dateStr
    });

    data.calories.push({
      type: 'calories',
      value: Math.round(baseCalories),
      unit: 'kcal',
      timestamp: date,
      date: dateStr
    });

    data.heart_rate.push({
      type: 'heart_rate',
      value: Math.round(baseHeartRate),
      unit: 'bpm',
      timestamp: date,
      date: dateStr
    });

    data.sleep.push({
      type: 'sleep',
      value: Number(baseSleep.toFixed(1)),
      unit: 'hours',
      timestamp: date,
      date: dateStr
    });

    data.weight.push({
      type: 'weight',
      value: Number(baseWeight.toFixed(1)),
      unit: 'kg',
      timestamp: date,
      date: dateStr
    });
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricType = searchParams.get('type') || 'all';
    const days = parseInt(searchParams.get('days') || '7');

    // Generate mock health data
    const healthData = generateMockHealthData(days);

    // Filter by metric type if specified
    let filteredData = healthData;
    if (metricType !== 'all') {
      filteredData = {
        ...healthData,
        steps: metricType === 'steps' ? healthData.steps : [],
        calories: metricType === 'calories' ? healthData.calories : [],
        heart_rate: metricType === 'heart_rate' ? healthData.heart_rate : [],
        sleep: metricType === 'sleep' ? healthData.sleep : [],
        weight: metricType === 'weight' ? healthData.weight : []
      };
    }

    return NextResponse.json({
      data: filteredData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health data API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { metricType = 'all', days = 7 } = await request.json();

    // Generate mock health data
    const healthData = generateMockHealthData(days);

    // Filter by metric type if specified
    let filteredData = healthData;
    if (metricType !== 'all') {
      filteredData = {
        ...healthData,
        steps: metricType === 'steps' ? healthData.steps : [],
        calories: metricType === 'calories' ? healthData.calories : [],
        heart_rate: metricType === 'heart_rate' ? healthData.heart_rate : [],
        sleep: metricType === 'sleep' ? healthData.sleep : [],
        weight: metricType === 'weight' ? healthData.weight : []
      };
    }

    return NextResponse.json({
      data: filteredData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health data POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
