import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function POST(request: NextRequest) {
  try {
    const { question, includeData = true } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Call MCP server for health Q&A
    const response = await mcpClient.askHealthQuestion(question, includeData);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to process health question' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: response.data.answer || response.data,
      timestamp: response.timestamp,
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
