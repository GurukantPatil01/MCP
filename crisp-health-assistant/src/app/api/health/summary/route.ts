import { NextRequest, NextResponse } from 'next/server';

// Mock health summary generator
function generateMockHealthSummary(period: 'today' | 'week' | 'month'): string {
  const summaries = {
    today: [
      "You're having a great day! You've been active with good step count and your heart rate looks healthy. Keep up the consistent activity level.",
      "Today shows steady progress in your health metrics. Your sleep from last night was refreshing, and you're on track with your daily goals.",
      "Your daily health indicators look positive. You've maintained good activity levels and your body metrics are within healthy ranges."
    ],
    week: [
      "This week shows excellent consistency in your health habits! Your average daily steps have increased by 12%, and your sleep quality has improved significantly. Your heart rate data indicates good cardiovascular fitness, and your calorie burn is well-balanced with your activity levels. Keep maintaining this healthy lifestyle!",
      "You've had a solid week of health progress. Your step count shows you're staying active, with an average of 9,200 steps daily. Sleep patterns indicate you're getting quality rest, averaging 7.2 hours per night. Your heart rate trends show good fitness levels, and your overall health metrics are trending positively.",
      "This week's data reflects your commitment to wellness. You've been consistently active with good step counts, your sleep duration has improved, and your cardiovascular metrics look healthy. Your calorie balance suggests you're maintaining good energy levels throughout the week."
    ],
    month: [
      "Over the past month, you've shown remarkable improvement in your overall health metrics! Your daily step average has increased by 18%, sleep quality has become more consistent, and your heart rate variability indicates improving cardiovascular health. Your weight management has been steady, and your overall wellness trends are very positive. This sustained improvement suggests your healthy habits are really paying off!",
      "Your monthly health summary shows consistent progress across all key metrics. You've maintained an average of 9,800 steps per day, your sleep patterns have stabilized with better quality rest, and your heart rate data shows improving fitness levels. The consistency in your health data over the past 30 days indicates you've successfully established sustainable wellness habits.",
      "This month demonstrates your dedication to health and wellness. Your activity levels have been consistently high, sleep quality has improved significantly, and all cardiovascular metrics are trending in a positive direction. Your health data shows you're successfully maintaining a balanced approach to fitness, nutrition, and rest."
    ]
  };

  const periodSummaries = summaries[period];
  return periodSummaries[Math.floor(Math.random() * periodSummaries.length)];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'today' | 'week' | 'month' || 'week';

    // Validate period parameter
    if (!['today', 'week', 'month'].includes(period)) {
      return NextResponse.json(
        { error: 'Period must be one of: today, week, month' },
        { status: 400 }
      );
    }

    // Generate mock health summary
    const summary = generateMockHealthSummary(period);

    return NextResponse.json({
      summary,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health summary API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { period = 'week' } = await request.json();

    if (!['today', 'week', 'month'].includes(period)) {
      return NextResponse.json(
        { error: 'Period must be one of: today, week, month' },
        { status: 400 }
      );
    }

    // Generate mock health summary
    const summary = generateMockHealthSummary(period);

    return NextResponse.json({
      summary,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health summary POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
