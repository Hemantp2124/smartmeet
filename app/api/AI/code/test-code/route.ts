// app/api/AI/code/test-code/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const testCodeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  testCases: z.array(z.object({
    input: z.any(),
    expected: z.any()
  })).optional(),
  provider: z.enum(['local', 'openai', 'claude']).default('local')
});

export async function POST(req: Request) {
  try {
    const { code, testCases, provider } = testCodeSchema.parse(await req.json());

    const response = await fetch(`${process.env.SUPERSMART_API_URL}/test-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPERSMART_API_KEY}`
      },
      body: JSON.stringify({ code, testCases, provider }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to test code');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Test execution error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
