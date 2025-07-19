"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/input";
import Button from "@/components/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup handler called");
    try {
      await signup({ username, email, password, confirmPassword });
      toast.success("Signup successful! Please log in.");
      router.push("/login");
    } catch {
      toast.error(error || "Signup failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/users/auth/google?redirect_uri=${encodeURIComponent(
      window.location.origin + "/users/auth/google/callback"
    )}`;
  };

  return (
    <div className="flex min-h-screen w-screen flex-col md:flex-row overflow-hidden h-full">
      <div className="hidden md:flex w-full md:w-[40%] h-64 md:h-full bg-[url('/assets/img/bg-auth.svg')] bg-cover bg-center relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-8xl font-bold text-white opacity-20 select-none">
            Lynqup
          </h1>
        </div>
      </div>

      <div className="w-full md:w-[60%] h-full bg-white flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Sign Up</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightIcon={
                showPassword ? (
                  <EyeOff
                    className="cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              rightIcon={
                showConfirmPassword ? (
                  <EyeOff
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )
              }
            />
            <Button
              type="submit"
              variant="primary"
              className={`w-full${
                isLoading ? " opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-border" />
            <span className="mx-2 text-muted-foreground text-sm">or</span>
            <div className="flex-grow h-px bg-border" />
          </div>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full py-3 text-primary"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
