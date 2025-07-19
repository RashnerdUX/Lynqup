"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/button";

export default function ProfilePictureUploadPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("Please upload an image file.");
        setProfileImage(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      console.log("Selected file:", file.name);
    } else {
      setProfileImage(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Profile Picture Submitted:",
      profileImage ? "Image selected" : "No image selected"
    );
    router.push("/onboarding/profile-creation-successful"); // Navigate to the next step
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
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            {" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let&apos;s know more
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                about you.
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Add the image you want on your profile
            </p>
          </div>

          <div className="flex justify-center mb-12">
            {" "}
            <div
              className="relative w-40 h-40 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden "
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
