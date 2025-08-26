// lib/middleware/errorHandler.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Define error types
type AppError = Error & {
  statusCode: number;
  details?: any;
  isOperational?: boolean;
};

// Type guards
const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error && 
         'statusCode' in error && 
         typeof (error as any).statusCode === 'number';
};

const isTrustedError = (error: unknown): boolean => {
  return isAppError(error) && (error.isOperational ?? true);
};

export function handleError(error: unknown) {
  console.error('Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation Error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Handle our custom AppError instances
  if (isAppError(error)) {
    const response = {
      error: error.message,
      ...(error.details && { details: error.details }),
    };

    // Log operational errors for monitoring
    if (isTrustedError(error)) {
      console.log('Operational Error:', error);
    } else {
      // Critical errors should trigger alerts
      console.error('Critical Error:', error);
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle unexpected errors
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Unexpected Error:', errorMessage);
  
  const response: Record<string, any> = { 
    error: 'Internal Server Error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.details = errorMessage;
    if (error instanceof Error && error.stack) {
      response.stack = error.stack;
    }
  }
  
  return NextResponse.json(response, { status: 500 });
}

// Helper function to wrap route handlers with error handling
export function withErrorHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async function (request: Request, ...args: any[]): Promise<Response> {
    try {
      return await handler(request, ...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

// Helper to handle async route handlers with proper error handling
export function asyncHandler(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return withErrorHandler(handler);
}