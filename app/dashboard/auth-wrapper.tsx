'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Helper function to clear auth data
  const clearAuthData = () => {
    if (typeof window === 'undefined') return;
    
    // Clear all auth-related data
    const authKeys = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'sb-user-data',
      'supabase.auth.token',
      ...Object.keys(localStorage).filter(key => key.startsWith('sb-')),
      ...Object.keys(sessionStorage).filter(key => key.startsWith('sb-')),
      ...Object.keys(localStorage).filter(key => key.startsWith('supabase.')),
      ...Object.keys(sessionStorage).filter(key => key.startsWith('supabase.'))
    ];

    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Authentication error:', error);
          clearAuthData();
          window.location.href = '/login';
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        window.location.href = '/login';
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          clearAuthData();
          window.location.href = '/login';
        }
      }
    );
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, supabase.auth]);

  return <>{children}</>;
}
