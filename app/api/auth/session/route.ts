import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const response = new NextResponse();
    
    // Create a Supabase client with the response cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.match(new RegExp(`${name}=([^;]+)`))?.[1];
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ 
              name, 
              value, 
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true
            });
          },
        },
      }
    );
    
    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the user data
    return new NextResponse(
      JSON.stringify({
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          image: session.user.user_metadata?.avatar_url
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Session error:', error);
    return new NextResponse(
      JSON.stringify({ user: null, error: 'Failed to get session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
