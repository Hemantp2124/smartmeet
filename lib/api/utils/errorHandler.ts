// lib/middleware/errorHandler.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation Error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : 
        undefined,
    },
    { status: 500 }
  );
}