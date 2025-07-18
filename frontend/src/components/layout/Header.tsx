import React fromreact';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from@/hooks/useUI;
import { Button } from@/components/ui/button;
import { Avatar, AvatarFallback, AvatarImage } from@/components/ui/avatar;
import { ROUTES } from '@/constants';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) =>[object Object]  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useUI();

  const handleLogout = async () => [object Object]  await logout();
  };

  return (
    <header className={`bg-white dark:bg-gray-90rder-b border-gray-200 dark:border-gray-700lassName}`}>
      <div className=max-w-7xl mx-auto px-4sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16          {/* Logo */}
          <div className=flex items-center">
            <Link href={ROUTES.HOME} className=text-xl font-bold text-gray-90dark:text-white">
              Lynqup
            </Link>
          </div>

      [object Object]/* Navigation */}
          <nav className="hidden md:flex space-x-8
            <Link href={ROUTES.HOME} className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
              Home
            </Link>
          [object Object]isAuthenticated && (
              <Link href={ROUTES.DASHBOARD} className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white>         Dashboard
              </Link>
            )}
          </nav>

      [object Object]/* Right side */}
          <div className=flexitems-center space-x-4>         {/* Theme toggle */}
            <Button
              variant="ghost"
              size=sm           onClick={toggleTheme}
              className="p-2   >
              {theme === light' ? '🌙' :☀️'}
            </Button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className=flexitems-center space-x-4>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant=outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className=flexitems-center space-x-2>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 