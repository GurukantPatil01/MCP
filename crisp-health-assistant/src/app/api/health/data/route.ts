import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricType = searchParams.get('type') || 'all';
    const days = parseInt(searchParams.get('days') || '7');

    // Call MCP server to get health data
    const response = await mcpClient.getHealthData(metricType, days);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch health data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: response.data,
      timestamp: response.timestamp
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

    const response = await mcpClient.getHealthData(metricType, days);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch health data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: response.data,
      timestamp: response.timestamp
    });
  } catch (error) {
    console.error('Health data POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
