// app/api/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiters for different endpoints
const aiRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds for AI endpoints
});

const authRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute for auth endpoints
  prefix: 'auth-',
});

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try to get the IP from common headers
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // Fallback to other headers
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  // Fallback to a default value (use with caution)
  return '127.0.0.1';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let ratelimit = null;
  let rateLimitType = '';

  // Apply rate limiting based on the endpoint
  if (pathname.startsWith('/api/AI')) {
    ratelimit = aiRateLimiter;
    rateLimitType = 'ai';
  } else if (pathname.startsWith('/api/auth')) {
    ratelimit = authRateLimiter;
    rateLimitType = 'auth';
  }

  if (ratelimit) {
    const ip = getClientIP(request);
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    // Add rate limit headers to the response
    const response = success 
      ? NextResponse.next()
      : new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests',
            message: `Rate limit exceeded for ${rateLimitType} endpoints`
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          }
        );

    // Add rate limit headers to all responses
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    response.headers.set('X-RateLimit-Type', rateLimitType);

    if (!success) {
      // Add Retry-After header for rate limited requests
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      response.headers.set('Retry-After', retryAfter.toString());
    }

    return response;
  }

  // Add security headers to all API responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Match all API routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Rate limit configuration types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // Upstash Redis REST URL
      UPSTASH_REDIS_REST_URL: string;
      // Upstash Redis REST Token
      UPSTASH_REDIS_REST_TOKEN: string;
    }
  }
}