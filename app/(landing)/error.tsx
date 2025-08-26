// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-left text-sm text-gray-400 overflow-auto max-h-60">
            <details>
              <summary className="cursor-pointer font-mono">Error Details</summary>
              <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                {error.stack}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
