"use client";
import { Suspense } from "react";
import GoogleCallbackPageInner from "./GoogleCallbackPageInner";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Signing in with Google...</div>}>
      <GoogleCallbackPageInner />
    </Suspense>
  );
}
