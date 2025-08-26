import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  return NextResponse.json(
    { 
      error: error || 'Authentication error occurred',
      success: false 
    },
    { status: 401 }
  );
}

export async function POST(request: Request) {
  const { error } = await request.json();
  
  return NextResponse.json(
    { 
      error: error || 'Authentication error occurred',
      success: false 
    },
    { status: 401 }
  );
}
