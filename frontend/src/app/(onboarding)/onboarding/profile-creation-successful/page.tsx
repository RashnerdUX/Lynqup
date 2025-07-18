"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

export default function ProfileCreationSuccessfulPage() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/onboarding/suggested-matches");
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
        <div className="w-full max-w-md text-center">
          {" "}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Creation
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                Successful.
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              You have successfully created your profile. Enjoy.
            </p>
          </div>
          <div className="flex justify-center mb-12">
            {" "}
            <span className="text-8xl">🥳</span>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full py-3 text-base "
            onClick={handleGetStarted}
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
