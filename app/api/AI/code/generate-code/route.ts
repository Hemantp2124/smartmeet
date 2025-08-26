// app/api/AI/code/generate-code/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const codeGenSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  language: z.string().default('typescript'),
  provider: z.enum(['openai', 'claude', 'gemini', 'groq']).default('openai'),
  temperature: z.number().min(0).max(2).default(0.7),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, language, provider, temperature } = codeGenSchema.parse(body);

    // Call Supersmart API
    const response = await fetch(`${process.env.SUPERSMART_API_URL}/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPERSMART_API_KEY}`
      },
      body: JSON.stringify({
        task: prompt,
        language,
        provider,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate code');
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      code: result.code,
      language: result.language,
      provider: result.provider,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}