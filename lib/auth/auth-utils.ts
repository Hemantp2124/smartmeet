import { supabase } from '@/lib/supabase';

export async function getAuthenticatedUser() {
  // Get the session first to check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { user: null, error: new Error('No active session') };
  }
  
  // Get the user with a fresh authentication check
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, error: error || new Error('Failed to authenticate user') };
  }
  
  return { user, error: null };
}

export async function requireAuthentication() {
  const { user, error } = await getAuthenticatedUser();
  
  if (error || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
