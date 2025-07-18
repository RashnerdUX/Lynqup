"use client";
import Image from "next/image";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen from-background-start-rgb to-background-end-rgb dark:from-background dark:to-background flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Decorative Gradient Circles */}

      {/* Company Name */}
      <div className="w-full text-center pt-10 pb-2 z-10">
        <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-chart-1 via-chart-4 to-primary text-primary-foreground font-extrabold text-2xl shadow-lg tracking-wide animate-fade-in">
          Lynqup
        </span>
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center py-16 relative z-10">
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in delay-100">
          Lynqup connects mentors and entrepreneurs, helping you build
          meaningful relationships and accelerate your growth.
        </p>
        <Button
          variant="primary"
          className="px-10 py-4 rounded-full font-bold shadow-2xl text-lg animate-fade-in delay-200 hover:scale-105 shadow-accent transition-all duration-300"
          type="button"
          onClick={() => router.push("/signup")}
        >
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 py-16 relative z-10">
        <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-border hover:scale-105 transition-transform duration-300 animate-fade-in delay-300">
          <Image
            src="/assets/img/Darrel.png"
            alt="Profile"
            width={90}
            height={90}
            className="rounded-full mb-5 shadow-lg border-4 border-accent"
          />
          <h2 className="text-2xl font-bold mb-3 text-primary">
            Personalized Matches
          </h2>
          <p className="text-base text-muted-foreground">
            Get matched with mentors and entrepreneurs who share your interests
            and goals.
          </p>
        </div>
        <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-border hover:scale-105 transition-transform duration-300 animate-fade-in delay-400">
          <Image
            src="/assets/img/jerome.png"
            alt="Community"
            width={90}
            height={90}
            className="rounded-full mb-5 shadow-lg border-4 border-chart-2"
          />
          <h2 className="text-2xl font-bold mb-3 text-chart-2">
            Vibrant Community
          </h2>
          <p className="text-base text-muted-foreground">
            Join a diverse, active community and expand your professional
            network.
          </p>
        </div>
        <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-border hover:scale-105 transition-transform duration-300 animate-fade-in delay-500">
          <Image
            src="/assets/img/kathryn.png"
            alt="Growth"
            width={90}
            height={90}
            className="rounded-full mb-5 shadow-lg border-4 border-chart-4"
          />
          <h2 className="text-2xl font-bold mb-3 text-chart-4">
            Grow Together
          </h2>
          <p className="text-base text-muted-foreground">
            Accelerate your journey with expert guidance and collaborative
            growth.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-10 text-muted-foreground relative z-10 animate-fade-in delay-700">
        <span className="text-lg">
          &copy; {new Date().getFullYear()} Lynqup. All rights reserved.
        </span>
      </footer>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        .animate-fade-in.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in.delay-300 {
          animation-delay: 0.3s;
        }
        .animate-fade-in.delay-400 {
          animation-delay: 0.4s;
        }
        .animate-fade-in.delay-500 {
          animation-delay: 0.5s;
        }
        .animate-fade-in.delay-600 {
          animation-delay: 0.6s;
        }
        .animate-fade-in.delay-700 {
          animation-delay: 0.7s;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
