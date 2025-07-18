"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/input";
import Button from "@/components/button";

export default function ProfileDetailsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile Details Submitted:");
    console.log("Full Name:", fullName);
    console.log("Role:", role);
    console.log("Skill:", skill);
    console.log("Interest:", interest);
    router.push("/onboarding/profile-picture-upload");
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's know more
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                about you.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full name
              </label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
              </label>
              <Input
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            <div>
              <label
                htmlFor="skill"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Skill
              </label>
              <Input
                type="text"
                id="skill"
                name="skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g., React, Node.js"
                required
              />
            </div>

            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Interest
              </label>
              <Input
                type="text"
                id="interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g., Web Development, AI"
                required
              />
            </div>

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
