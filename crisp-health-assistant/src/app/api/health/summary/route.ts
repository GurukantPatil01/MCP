import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'today' | 'week' | 'month' || 'week';

    const response = await mcpClient.getHealthSummary(period);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to generate health summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary: response.data.summary || response.data,
      period,
      timestamp: response.timestamp
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

    const response = await mcpClient.getHealthSummary(period);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to generate health summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary: response.data.summary || response.data,
      period,
      timestamp: response.timestamp
    });
  } catch (error) {
    console.error('Health summary POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
