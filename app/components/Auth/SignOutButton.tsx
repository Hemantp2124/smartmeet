'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cn } from '@/lib/utils/cn';

type SignOutButtonProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showIcon?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  onSignOut?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SignOutButton({
  className,
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children = 'Sign Out',
  fullWidth = false,
  onSignOut,
  ...props
}: SignOutButtonProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Set mounted state to prevent hydration issues
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSignOut = async () => {
    if (isLoading || !isMounted) return;
    
    setIsLoading(true);
    
    try {
      // 1. Sign out using Supabase first
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 2. Clear all client-side authentication data
      clearAuthData();
      
      // 3. Call the optional onSignOut callback
      onSignOut?.();
      
      // 4. Show success message
      toast.success('You have been signed out successfully');
      
      // 5. Force a full page reload to the auth page
      // This ensures all application state is cleared
      window.location.href = '/auth';
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out. Please try again.');
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  
  // Helper function to clear authentication data
  const clearAuthData = () => {
    if (typeof window === 'undefined') return;
    
    // Clear all Supabase related data
    const supabaseKeys = [
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

    // Remove all found keys from both storage locations
    supabaseKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  if (!isMounted) {
    // Return a placeholder while mounting to prevent hydration issues
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'h-10 px-4 py-2 opacity-50',
          fullWidth && 'w-full',
          className
        )}
        disabled
      >
        {showIcon && <LogOut className={cn('h-4 w-4', children ? 'mr-2' : '')} />}
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'h-10 px-4 py-2', // default size
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        variant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20',
        variant === 'link' && 'text-primary underline-offset-4 hover:underline text-red-500',
        size === 'sm' && 'h-9 px-3 rounded-md',
        size === 'lg' && 'h-11 px-8 rounded-md',
        size === 'icon' && 'h-10 w-10',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          {children && 'Signing out...'}
        </span>
      ) : (
        <>
          {showIcon && <LogOut className={cn('h-4 w-4', children ? 'mr-2' : '')} />}
          {children}
        </>
      )}
    </button>
  );
}
