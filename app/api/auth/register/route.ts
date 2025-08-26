import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { createAuthCookies, getCookie } from '@/lib/services/auth/cookies'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Create response object
    const response = new NextResponse()

    // Create Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name: string) => {
            return await getCookie(name);
          },
          set() {
            // Cookie setting is handled by our utility
          },
          remove() {
            // Cookie removal is handled by our utility
          },
        },
      }
    )

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${new URL(request.url).origin}/dashboard`
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 400 }
      )
    }

    // Set auth cookies if session exists
    if (data.session?.access_token && data.session.refresh_token) {
      createAuthCookies(response, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      })
    }
    
    // Prepare response data
    const responseData = {
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name
      }
    }
    
    // Return response with user data and cookies
    return NextResponse.json(responseData, {
      status: 201,
      headers: response.headers
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}