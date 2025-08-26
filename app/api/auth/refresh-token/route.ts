// app/api/auth/refresh-token/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAuthCookies, getCookie } from '@/lib/services/auth/cookies'
import { z } from 'zod'
import { LRUCache } from 'lru-cache'

// Simple in-memory rate limiter
const rateLimitCache = new LRUCache<string, number[]>({
  max: 1000, // Max 1000 unique IPs
  ttl: 60 * 1000, // 1 minute
})

// Rate limiting configuration - 5 requests per minute per IP
const RATE_LIMIT_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute

// Input validation schema
const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
})

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()
    
    // Get or initialize the request timestamps for this IP
    const requestTimestamps = rateLimitCache.get(ip) || []
    const windowStart = now - RATE_LIMIT_WINDOW_MS
    
    // Filter out old requests outside the current window
    const recentRequests = requestTimestamps.filter(time => time > windowStart)
    
    // Check if rate limit is exceeded
    if (recentRequests.length >= RATE_LIMIT_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
    
    // Add current request timestamp and update cache
    recentRequests.push(now)
    rateLimitCache.set(ip, recentRequests)

    // Parse and validate request body
    const body = await request.json()
    const validation = refreshTokenSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { refresh_token } = validation.data
    const response = new NextResponse()
    
    // Create Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name: string) => await getCookie(name),
          set() { /* Handled by our utility */ },
          remove() { /* Handled by our utility */ },
        },
      }
    )
    
    // Invalidate the current refresh token and get new tokens
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    })

    if (error) {
      console.error('Token refresh failed:', error.message)
      throw error
    }

    if (!data.session) {
      throw new Error('No session data returned')
    }

    // Set new auth cookies
    if (data.session.access_token && data.session.refresh_token) {
      createAuthCookies(response, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      })
    }

    // Don't expose the refresh token in the response
    const { refresh_token: _, ...sessionData } = data.session

    const responseData = {
      ...sessionData,
      token_type: 'bearer',
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
      } : null
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: response.headers,
    })
  } catch (error: any) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to refresh session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 401 }
    )
  }
}