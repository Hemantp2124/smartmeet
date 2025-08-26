// app/(auth)/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token_hash') || searchParams.get('token');
  const type = searchParams.get('type');
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          password: values.password,
          type: type || 'recovery' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast.success('Password reset successful! You can now sign in with your new password.');
      router.push('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while resetting your password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Invalid Token</h1>
        <p className="text-gray-400">The reset link is invalid or has expired.</p>
        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md p-3">
          <Link href="/forgot-password">Request a new reset link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="text-sm text-gray-400 mt-2">Enter your new password below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-400">New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-pink-400" />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-400">Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-pink-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md p-3 font-semibold disabled:opacity-70"
            disabled={form.formState.isSubmitting}
            aria-busy={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
