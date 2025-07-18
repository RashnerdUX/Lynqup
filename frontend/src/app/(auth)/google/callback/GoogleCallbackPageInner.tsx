"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store";
import { googleLogin } from "@/store/slices/authSlice";

export default function GoogleCallbackPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    (async () => {
      try {
        await dispatch(googleLogin(params)).unwrap();
        router.push("/dashboard");
      } catch (error) {
        console.error("Google login failed:", error);
        router.push("/login?error=google");
      }
    })();
  }, [dispatch, router, searchParams]);

  return <div>Signing in with Google...</div>;
}
