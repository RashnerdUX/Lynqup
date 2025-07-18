import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import Button from "@/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useUI();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${
        className || ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={ROUTES.HOME}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Lynqup
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href={ROUTES.HOME}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href={ROUTES.DASHBOARD}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button variant="outline" onClick={toggleTheme} className="p-2">
              {theme === "light" ? "🌙" : "☀️"}
            </Button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-8 px-2 text-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="outline" className="h-8 px-2 text-sm">
                    Login
                  </Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button className="h-8 px-2 text-sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
