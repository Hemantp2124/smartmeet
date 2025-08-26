import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/middleware/errorHandler';
import { z, ZodType } from 'zod';

// Define local error types
type AppError = Error & {
  statusCode: number;
  details?: any;
};

class ValidationError extends Error {
  constructor(public errors: any) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

type ApiHandler = (
  req: NextRequest,
  context: { params?: Record<string, string> }
) => Promise<NextResponse>;

export function createApiHandler(handler: ApiHandler) {
  return async (req: NextRequest, { params = {} } = {}) => {
    try {
      // Set CORS headers
      const response = await handler(req, { params });
      
      // Ensure we have a response object
      if (!response) {
        throw new Error('No response returned from handler');
      }

      // Add security headers to all responses
      const headers = new Headers(response.headers);
      
      // Security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      headers.set('Referrer-Policy', 'same-origin');
      headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      
      // CORS headers
      const origin = req.headers.get('origin');
      if (origin) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        headers.set('Access-Control-Allow-Credentials', 'true');
      }

      // Return response with security headers
      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}

// Helper for common response formats
export const ApiResponse = {
  success: (data: any, status = 200) => 
    NextResponse.json({ success: true, data }, { status }),
    
  error: (message: string, status = 400, details?: any) =>
    NextResponse.json({ success: false, error: message, details }, { status }),
    
  notFound: (message = 'Resource not found') =>
    NextResponse.json({ success: false, error: message }, { status: 404 }),
    
  unauthorized: (message = 'Unauthorized') =>
    NextResponse.json({ success: false, error: message }, { status: 401 }),
    
  forbidden: (message = 'Forbidden') =>
    NextResponse.json({ success: false, error: message }, { status: 403 }),
    
  serverError: (message = 'Internal Server Error') =>
    NextResponse.json({ success: false, error: message }, { status: 500 }),
};

// Helper to validate request body against a Zod schema
export async function validateRequest<T>(
  req: NextRequest,
  schema: ZodType<T>
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors);
    }
    throw new BadRequestError('Invalid request body');
  }
}

// Re-export error types for convenience
export * from './errors';
