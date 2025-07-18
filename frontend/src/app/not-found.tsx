"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  ArrowLeft,
  Search,
  MapPin,
  Compass,
  RefreshCw,
  HelpCircle,
  Mail,
} from "lucide-react";
import { ClientOnly } from "@/components/client-only";

const NotFoundPage = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleGoHome = () => {
    router.push("/service-user/auth/login");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push("/search");
  };

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);

  // Orbiting elements around the 404
  const orbitingElements = [
    { icon: Search, delay: 0, radius: 120 },
    { icon: MapPin, delay: 1, radius: 140 },
    { icon: Compass, delay: 2, radius: 160 },
    { icon: HelpCircle, delay: 3, radius: 180 },
  ];

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-mint-green)] via-white to-[var(--color-pale-blue)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--color-forest-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--color-muted-navy)] urbanist">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-mint-green)] via-white to-[var(--color-pale-blue)] relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-grid-pattern animate-pulse" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle}
              className="absolute w-2 h-2 bg-gradient-to-r from-[var(--color-forest-green)] to-[var(--color-deep-blue)] rounded-full opacity-60"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          {/* 404 Error Code with Orbiting Elements */}
          <div className="relative my-8 sm:my-12">
            {/* Orbiting Elements */}
            {orbitingElements.map((element, index) => {
              const Icon = element.icon;
              return (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 15 + element.delay * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: element.delay,
                  }}
                  style={{
                    width: element.radius * 2,
                    height: element.radius * 2,
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 15 + element.delay * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: element.delay,
                    }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--color-forest-green)]/20 flex items-center justify-center shadow-lg">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--color-forest-green)]" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="text-center"
            >
              <motion.h1
                className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-bold gradient-text leading-none"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                404
              </motion.h1>
            </motion.div>
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-deep-purple)] mb-4 sm:mb-6 sora"
            >
              Oops! Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-[var(--color-muted-navy)] mb-6 sm:mb-8 urbanist leading-relaxed px-4"
            >
              The page you&apos;re looking for seems to have wandered off.
              Don&apos;t worry, even the best explorers sometimes take a wrong
              turn. Let&apos;s get you back on the right path to quality
              healthcare.
            </motion.p>

            {/* Animated Search Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-mint-green)] to-[var(--color-pale-blue)] opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-white/60 backdrop-blur-sm border border-[var(--color-forest-green)]/30 flex items-center justify-center"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[var(--color-forest-green)]" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="flex-1 bg-gradient-to-r from-[var(--color-forest-green)] to-[var(--color-deep-blue)] text-white px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base urbanist shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Go Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="flex-1 bg-white/80 backdrop-blur-sm text-[var(--color-forest-green)] px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base urbanist border border-[var(--color-forest-green)]/20 hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center text-sm sm:text-base"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="text-[var(--color-forest-green)] hover:text-[var(--color-deep-blue)] transition-colors duration-300 flex items-center gap-2 urbanist font-medium"
            >
              <Search className="w-4 h-4" />
              Search Our Site
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-[var(--color-muted-navy)] hover:text-[var(--color-forest-green)] transition-colors duration-300 flex items-center gap-2 urbanist font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh Page"}
            </motion.button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <p className="text-[var(--color-muted-purple)] text-sm urbanist mb-2">
              Still need help? Our support team is here for you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[var(--color-forest-green)] hover:text-[var(--color-deep-blue)] transition-colors duration-300 flex items-center gap-2 mx-auto urbanist font-medium text-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Wave at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <motion.svg
            className="w-full h-24 sm:h-32 md:h-40"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <motion.path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="url(#waveGradient)"
              animate={{
                d: [
                  "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
                  "M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z",
                  "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-forest-green)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="50%"
                  stopColor="var(--color-deep-blue)"
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-mint-green)"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </div>
    </ClientOnly>
  );
};

export default NotFoundPage;
