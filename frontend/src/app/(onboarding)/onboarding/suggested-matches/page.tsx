"use client";
import React from "react";

import Button from "@/components/button";
import { useRouter } from "next/navigation";
export default function SuggestedMatchesPage() {
  const router = useRouter();

  const suggestedProfiles = [
    {
      id: 1,
      name: "Darrell Steward",
      followers: 120,
      following: 50,
      role: "Data Analyst",
      imageUrl: "/assets/img/Darrel.png",
    },
    {
      id: 2,
      name: "Kathryn Murphy",
      followers: 90,
      following: 30,
      role: "Data Analyst",
      imageUrl: "/assets/img/kathryn.png",
    },
    {
      id: 3,
      name: "Jerome Bell",
      followers: 150,
      following: 70,
      role: "Data Analyst",
      imageUrl: "/assets/img/jerome.png",
    },
  ];

  const handleFollow = (profileId: number, profileName: string) => {
    console.log(
      `Follow button clicked for profile ID: ${profileId}, Name: ${profileName}`
    );
  };

  const handleGoToHome = () => {
    console.log("Go to Home button clicked. Navigating to main application.");
    router.push("/dashboard");
  };

  const handleSkip = () => {
    console.log(
      "Skip button clicked. Navigating to main application without following."
    );

    router.push("/dashboard"); // Navigate to the main application dashboard
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

      <div className="w-full md:w-[60%] h-full bg-card flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Few suggested matches for you.
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              We used your provided info to suggest few account to follow that
              matched your interests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {suggestedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="
                  bg-card border border-border rounded-xl shadow-md p-4 text-center
                  transform transition-all duration-300 ease-in-out
                  hover:scale-108 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent hover:border-card hover:bg-card
                "
              >
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/100x100/E0E0E0/333333?text=${profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}`;
                  }}
                />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {profile.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {profile.followers} Followers • {profile.following} Following
                </p>
                <p className="text-primary text-sm font-medium mb-4">
                  {profile.role}
                </p>
                <Button
                  variant="primary"
                  className="w-full py-2 cursor-pointer "
                  onClick={() => handleFollow(profile.id, profile.name)}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto py-3 text-base cursor-pointer  px-8"
              onClick={handleGoToHome}
            >
              Go to Home
            </Button>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 hover:underline text-sm cursor-pointer font-medium px-8 py-3"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
