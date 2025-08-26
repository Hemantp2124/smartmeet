'use client';

import { ThemeProvider } from '@/app/components/dashboard/providers/ThemeProvider';
import { SessionProvider } from '@/app/components/providers/session-provider';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
