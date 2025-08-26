import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, ...(error.details && { details: error.details }) },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new ApiError(400, 'Invalid JSON body');
  }
}

export function requireAuth(request: Request) {
  // This is a placeholder - in a real app, you would validate the session
  // using your auth system (e.g., NextAuth, Supabase Auth, etc.)
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new ApiError(401, 'Authentication required');
  }
  
  // In a real app, you would validate the token here
  // For now, we'll just return a mock user ID
  return { userId: 'user-123' };
}
