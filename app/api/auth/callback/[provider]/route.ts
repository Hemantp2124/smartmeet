// app/api/auth/callback/[provider]/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  // Ensure params are properly awaited
  const { provider } = await Promise.resolve(params);
  
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirectPath = requestUrl.searchParams.get('redirectedFrom') || '/dashboard';
  const redirectUrl = new URL(redirectPath, request.url)

  try {
    // Handle OAuth errors
    if (error) {
      console.error(`[Auth] OAuth error from ${provider}:`, {
        error,
        description: errorDescription,
      });
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    if (!code) {
      console.error('[Auth] No code provided in OAuth callback');
      return NextResponse.redirect(
        new URL('/login?error=no_code_provided', request.url)
      );
    }

    // Create a response object for the redirect
    const response = NextResponse.redirect(redirectUrl)
    
    // Create a Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2]
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
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              path: '/',
              maxAge: 0,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true
            })
          },
        },
      }
    )

    // Exchange the code for a session
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError) {
      console.error('[Auth] Error exchanging code for session:', authError);
      throw authError;
    }

    if (!session) {
      throw new Error('No session returned after code exchange');
    }

    console.log('[Auth] Successfully authenticated user:', session.user?.email);
    
    // Set the auth token in the response cookies
    response.cookies.set({
      name: 'sb-auth-token',
      value: session.access_token,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: session.expires_in || 3600
    });
    
    return response;
    
  } catch (error: any) {
    console.error(`[Auth] Error in OAuth callback for ${provider}:`, error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(
        error.message || 'Authentication failed. Please try again.'
      )}`, origin)
    );
  }
}
