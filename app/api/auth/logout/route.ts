// app/api/auth/logout/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { clearAuthCookies, getCookie } from '@/lib/services/auth/cookies'

export async function POST() {
  try {
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

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

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 400 }
      )
    }

    // Clear auth cookies using our utility
    clearAuthCookies(response)

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to log out' },
      { status: 500 }
    )
  }
}