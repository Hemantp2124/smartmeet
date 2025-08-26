"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import SocialLogin from "@/app/components/Auth/SocialLogin";  

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "details">("email");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === "email") {
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      setStep("details");
      return;
    }

    // Form validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    try {
      setLoading(true);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      // Wait for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force a refresh of the auth state
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        toast.success("Registration successful! Redirecting...");
        window.location.href = "/dashboard";
      } else {
        toast.success("Registration successful! Please check your email to confirm your account.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>

      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        By continuing you agree that you have read and accept the{" "}
        <a href="/terms" className="text-pink-400 hover:underline">
          Terms of Service
        </a>{" "}
        and acknowledge the{" "}
        <a href="/privacy" className="text-pink-400 hover:underline">
          Privacy Policy
        </a>.
      </p>

      <form onSubmit={handleSubmit}>
        {step === "email" ? (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
            <button
              type="submit"
              disabled={!formData.email}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md p-3 font-semibold mb-4 disabled:opacity-70"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#0d0d0d] border border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md p-3 font-semibold flex items-center justify-center"
              >
                {loading ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-pink-400 hover:underline text-sm"
              >
                ← Back
              </button>
            </div>
          </>
        )}
      </form>

      <p className="text-sm text-gray-400 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-pink-400 hover:underline">
          Sign in
        </Link>
      </p>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <SocialLogin />
    </div>
  );
}
