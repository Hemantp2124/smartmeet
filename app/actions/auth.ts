'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
  try {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
  } catch (error) {
    console.error('[Auth] Sign out error:', error);
    throw error;
  } finally {
    // Always redirect to home after sign out
    redirect('/');
  }
}
