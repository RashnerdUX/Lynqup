import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import ClientProvider from "./ClientProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lynqup Login Page",
  description: "Welcome back to Lynqup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full m-0 p-0 overflow-hidden`}>
        <ClientProvider>
          {children}
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  );
}
