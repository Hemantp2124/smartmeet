// components/Auth/SocialLogin.tsx
"use client";

import { FaApple, FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SocialLogin() {
  const router = useRouter();
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const redirectUrl = `${window.location.origin}/api/auth/callback/${provider}`;
      console.log(`[Auth] Starting ${provider} OAuth flow`);
      console.log(`[Auth] Redirect URL: ${redirectUrl}`);
      
      // Clear any existing auth state
      await supabase.auth.signOut();
      
      // Store current URL for post-auth redirect
      const currentUrl = new URL(window.location.href);
      sessionStorage.setItem('preAuthUrl', currentUrl.pathname + currentUrl.search);
      
      // Start the OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('[Auth] OAuth error:', error);
        throw error;
      }
      
      if (data?.url) {
        // Redirect to provider's auth page
        window.location.href = data.url;
        return;
      }
      
      throw new Error('No authentication URL returned from provider');
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      toast.error(error.message || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 mb-6">
      <button 
        onClick={() => handleSocialLogin('google')}
        className="w-full border border-gray-700 rounded-full p-3 text-white mb-2 flex items-center justify-center gap-2 hover:bg-gray-800"
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>

      <button 
        onClick={() => handleSocialLogin('github')}
        className="w-full border border-gray-700 rounded-full p-3 text-white mb-2 flex items-center justify-center gap-2 hover:bg-gray-800"
      >
        <FaGithub size={20} />
        Continue with GitHub
      </button>
    </div>
  );
}