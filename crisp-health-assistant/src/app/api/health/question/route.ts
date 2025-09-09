import { NextRequest, NextResponse } from 'next/server';

// Mock health question response generator
function generateMockHealthAnswer(question: string): string {
  const q = question.toLowerCase();
  
  // Activity-related questions
  if (q.includes('active') || q.includes('step') || q.includes('walk') || q.includes('exercise')) {
    const responses = [
      "Based on your recent activity data, you're doing great! You've been averaging around 9,200 steps per day this week, which is well within the recommended range. Your activity levels show good consistency with some nice peaks on your more active days. Keep up the excellent work!",
      "Your activity levels look very positive! You've been maintaining good daily step counts, and I can see you've been quite consistent with your movement patterns. This week shows you're staying well above the basic activity recommendations. Consider adding some variety with different types of exercises to keep it interesting.",
      "You're showing excellent activity patterns! Your step count data indicates you're regularly hitting healthy movement goals. Your most active days show you're capable of even higher activity levels, which is fantastic for your cardiovascular health."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Sleep-related questions
  if (q.includes('sleep') || q.includes('rest') || q.includes('tired')) {
    const responses = [
      "Your sleep patterns look quite good! You're averaging about 7.2 hours per night, which falls within the recommended 7-9 hour range for adults. Your sleep consistency has improved recently, and your data shows you're getting quality rest. Try to maintain your current bedtime routine as it seems to be working well for you.",
      "Based on your sleep data, you're getting solid rest most nights. Your sleep duration has been fairly consistent, averaging around 7-8 hours. This is excellent for recovery and overall health. If you want to optimize further, consider keeping a consistent sleep schedule even on weekends.",
      "Your sleep quality appears to be improving! The data shows you're getting adequate rest, which is crucial for your overall health and recovery. Your sleep patterns suggest you've found a good rhythm that works for your body."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Heart rate or fitness questions
  if (q.includes('heart') || q.includes('fitness') || q.includes('cardio')) {
    const responses = [
      "Your heart rate data indicates good cardiovascular fitness! Your resting heart rate appears to be in a healthy range, and your heart rate variability suggests your body is recovering well from activities. This is a great sign of overall fitness and cardiovascular health.",
      "Looking at your heart rate trends, you're showing signs of good cardiovascular fitness. Your heart rate responses during activities are appropriate, and your recovery rates look healthy. Keep up with your current activity levels to maintain this excellent cardiovascular health.",
      "Your cardiovascular metrics are looking very positive! Your heart rate data shows you have good fitness levels and your heart is responding well to both activity and rest. This indicates a healthy cardiovascular system."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Calorie or weight questions
  if (q.includes('calorie') || q.includes('weight') || q.includes('diet') || q.includes('nutrition')) {
    const responses = [
      "Based on your activity and calorie data, you're maintaining a good balance between energy intake and expenditure. Your calorie burn from activities shows you're staying active, which is excellent for maintaining a healthy weight and overall wellness.",
      "Your calorie and activity data suggest you're doing well with energy balance. You're burning calories through regular activity, and your patterns show consistency in your approach to health and fitness.",
      "Looking at your metrics, you're maintaining good energy balance through your active lifestyle. Your calorie expenditure from activities is contributing positively to your overall health goals."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Health trends questions
  if (q.includes('trend') || q.includes('progress') || q.includes('improve') || q.includes('better')) {
    const responses = [
      "Your health trends are looking very positive! Over the past week, I can see improvements in multiple areas. Your activity levels have been consistent, your sleep quality has stabilized, and your overall health metrics are trending in the right direction. You're making excellent progress!",
      "The trends in your health data are encouraging! You're showing steady improvement across several key metrics. Your consistency in maintaining healthy habits is really paying off, and the data reflects your commitment to wellness.",
      "Your health progress is impressive! The data shows you're successfully maintaining positive health behaviors. Your metrics indicate sustained improvement in your fitness levels and overall wellness patterns."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Tips and advice questions
  if (q.includes('tip') || q.includes('advice') || q.includes('suggest') || q.includes('recommend')) {
    const responses = [
      "Based on your current health data, here are some personalized tips: Keep up your excellent activity levels, but consider adding some variety to your routine. Your sleep patterns are good - try to maintain consistency. Consider incorporating some strength training if you haven't already, and don't forget to stay hydrated throughout the day!",
      "Looking at your health patterns, I'd suggest: Continue your consistent activity levels as they're working well for you. Your sleep schedule seems optimal, so stick with it. Consider tracking your hydration and maybe add some flexibility/stretching exercises to complement your current routine.",
      "Here are some tailored suggestions based on your data: Your activity levels are great, so focus on maintaining that consistency. Consider setting small weekly goals to keep motivated. Your sleep quality is good, which is excellent for recovery. Maybe try incorporating some mindfulness or stress management techniques to complement your physical health efforts."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // General health questions
  return "Based on your recent health data, you're doing really well overall! Your activity levels are consistent, your sleep patterns look healthy, and your vital signs are all within good ranges. Keep up the great work with your health and fitness routine. Is there a specific aspect of your health you'd like me to focus on?";
}

export async function POST(request: NextRequest) {
  try {
    const { question, includeData = true } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate mock health answer
    const answer = generateMockHealthAnswer(question);

    return NextResponse.json({
      answer,
      timestamp: new Date().toISOString(),
      healthDataIncluded: includeData
    });
  } catch (error) {
    console.error('Health question API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
