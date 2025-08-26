import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=No authentication code provided`
    );
  }

  try {
    const response = new NextResponse();
    const cookieStore = cookies();
    
    // Get all cookies as a string for the get function
    const cookieString = cookieStore.toString();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const match = cookieString.match(new RegExp(`(^| )${name}=([^;]+)`));
            return match ? match[2] : null;
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
              maxAge: 0
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // Get the session to verify
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No session found after authentication');
    }

    // Set the session in the response cookies
    response.cookies.set({
      name: 'sb-access-token',
      value: session.access_token,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: session.expires_in
    });
    
    response.cookies.set({
      name: 'sb-refresh-token',
      value: session.refresh_token || '',
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Redirect to the dashboard or the next URL
    const redirectUrl = new URL(next, requestUrl.origin);
    return NextResponse.redirect(redirectUrl, {
      headers: response.headers
    });
    
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`
    );
  }
}