// app/api/AI/code/generate-docs/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const docGenSchema = z.object({
  code: z.string().min(1, "Code is required"),
  format: z.enum(['markdown', 'jsdoc', 'tsdoc']).default('markdown'),
  style: z.enum(['concise', 'detailed', 'tutorial']).default('detailed')
});

export async function POST(req: Request) {
  try {
    const { code, format, style } = docGenSchema.parse(await req.json());

    const response = await fetch(`${process.env.SUPERSMART_API_URL}/generate-docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPERSMART_API_KEY}`
      },
      body: JSON.stringify({ code, format, style }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate documentation');
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      documentation: result.documentation,
      format: result.format,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Documentation generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate documentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}