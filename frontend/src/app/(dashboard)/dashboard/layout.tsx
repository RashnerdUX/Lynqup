/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Lynqup Dashboard",
  description:
    "Your space for growth, connect, learn, and thrive with like-minded entrepreneurs.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
