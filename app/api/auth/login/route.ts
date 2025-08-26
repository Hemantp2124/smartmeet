import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAuthCookies, getCookie } from "@/lib/services/auth/cookies";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password }: LoginRequest = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Prepare response object for cookie handling
    const response = NextResponse.next();

    // Create Supabase client with server-side cookie management
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => getCookie(name),
          set() {
            /* handled by custom util */
          },
          remove() {
            /* handled by custom util */
          },
        },
      }
    );

    // Attempt to sign in the user
    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Invalid email or password" },
        { status: error.status || 400 }
      );
    }

    // If successful, persist auth cookies
    if (data.session?.access_token && data.session.refresh_token) {
      createAuthCookies(response, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      });

      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
          },
        },
        {
          status: 200,
          headers: response.headers, // attach cookies
        }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
