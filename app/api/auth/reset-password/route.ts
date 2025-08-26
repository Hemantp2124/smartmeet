import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { token, password, type = 'recovery' } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // For password reset, we'll use the token directly
    if (type === 'recovery') {
      // Verify the OTP token
      const { data, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (verifyError || !data?.user) {
        console.error('Token verification failed:', verifyError);
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }

      // Update the user's password using admin client
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        data.user.id,
        { password }
      );

      if (updateError) {
        console.error('Password update error:', updateError);
        return NextResponse.json(
          { error: updateError.message || 'Failed to update password' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: 'Password reset successful' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}
