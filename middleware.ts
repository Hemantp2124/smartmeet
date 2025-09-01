import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

// API routes that don't require authentication
const publicApiPaths = [
  '/api/auth/callback',
  '/api/auth/session'
];

// Match any path that starts with these patterns
const publicPathPatterns = [
  /^\/api\/auth\/callback\//,  // Match any auth callback
  /^\/_next\//,                // Match Next.js internal paths
  /^\/favicon\.ico$/           // Match favicon
];

// Auth path that should redirect to dashboard if already authenticated
const authPaths = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestUrl = new URL(request.url);
  const response = NextResponse.next();
  
  // Create a Supabase client with the response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, {
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          });
        },
        remove(name: string, options: any) {
          response.cookies.set(name, '', {
            ...options,
            path: '/',
            maxAge: 0,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          });
        },
      },
    }
  );

  // Get the user session securely
  const { data: { user }, error } = await supabase.auth.getUser();
  const authToken = request.cookies.get('sb-auth-token')?.value;
  
  // If user is signed in and the current path is an auth path, redirect to dashboard or the original destination
  if (user || authToken) {
    if (authPaths.some(path => pathname.startsWith(path))) {
      const redirectTo = request.nextUrl.searchParams.get('redirectedFrom') || '/dashboard';
      const redirectUrl = new URL(redirectTo, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  ) || publicApiPaths.some(apiPath => 
    pathname === apiPath || pathname.startsWith(`${apiPath}/`)
  ) || publicPathPatterns.some(pattern => 
    pattern.test(pathname)
  );

  // Handle auth callback - let it pass through without modification
  if (pathname.startsWith('/api/auth/callback/')) {
    return NextResponse.next();
  }

  // If it's a public path, continue without checking auth
  if (isPublicPath) {
    return response;
  }

  // If user is not signed in and the current path is not public, redirect to login
  if (!user && !authToken) {
    const redirectUrl = new URL('/auth', request.url);
    const redirectPath = pathname + request.nextUrl.search;
    redirectUrl.searchParams.set('redirectedFrom', redirectPath);
    return NextResponse.redirect(redirectUrl);
  }

  // For API auth routes, ensure proper CORS headers
  if (pathname.startsWith('/api/auth/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public folder files
     * - api/auth (auth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$|^/api/auth/).*)',
  ],
};
