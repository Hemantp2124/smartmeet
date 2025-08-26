'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Simple user shape based on Supabase session response in app/api/auth/session/route.ts
export type AppUser = {
  id: string;
  email: string | null;
  name?: string;
  image?: string;
} | null;

export type AppSessionContextType = {
  user: AppUser;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AppSessionContext = createContext<AppSessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/session', {
        cache: 'no-store',
        credentials: 'include', // ✅ important so Supabase cookies (sb-access-token) are sent
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data?.user ?? null);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Error loading session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // initial fetch
    loadSession();

    // optional: revalidate session when window regains focus
    const handleFocus = () => loadSession();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadSession]);

  const value: AppSessionContextType = {
    user,
    loading,
    refresh: loadSession,
  };

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession(): AppSessionContextType {
  const ctx = useContext(AppSessionContext);
  if (!ctx) throw new Error('useAppSession must be used within SessionProvider');
  return ctx;
}
