import React fromreact;
import { ROUTES } from '@/constants';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-gray-50bg-gray-90rder-t border-gray-200 dark:border-gray-700lassName}`}>
      <div className=max-w-7xl mx-auto px-4sm:px-6-8 py-12    <div className="grid grid-cols-1 md:grid-cols-4 gap-8       {/* Company Info */}
          <div className=col-span-1an-2>     <h3 className="text-lg font-semibold text-gray-90dark:text-white mb-4
              Lynqup
            </h3>
            <p className="text-gray-60dark:text-gray-300 mb-4        Connecting people through meaningful relationships and shared experiences.
            </p>
            <div className=flex space-x-4>
              <a href="#" className="text-gray-400over:text-gray-50rk:hover:text-gray-300>
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColorviewBox="0 0 24 24">
                  <path d="M8.29 20251c7.547 010.675.25311.675-110.67500.178 0355012-0.53A8.348 8.348 000225.92a8.19.19001-2.357.646 4.118 411800010.84-20.27 80.2248224001-2.605.996 40.17 40.170 0-6993 3.743 11.65 11.65 01-8.457-4.287 4106410600010.27 5.477A4.072.0720 0128 90.713v.52a4.105 4.105 003.292 4.22 40.0954.095 01-18530.07 4.108 410800030.834 20.85A823380.233 1218.40710.616 11.6160/>
                </svg>
              </a>
              <a href="#" className="text-gray-400over:text-gray-50rk:hover:text-gray-300>
                <span className=sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColorviewBox="0 0 24 24">
                  <path fillRule=evenodd d=M12 2C64772 2 60.484 212.0170 40.425 20.865 80.18 6.839954592.682-0.2170.6820.4830237008-0.868013-1.703-2.782.605-3.369-10.343-30.369-10.343-0.454-10.158-1.111.466-1.111466-0.980.62.06968.06960810030.07 1.531 132 153110320.892 10.532341188 291.832.92-.64735-188.636-1.338-2.22-.253-4.555-1.113.555-40.951 0-10930.39-10.988129-2688-0.103253-.446-127298-20.65 00.84-0.27 20.75 1.26A9.5649.56400112.844c.8504.705.115 2.504.337 1.909-1.296 2.747-127 2.747.027.546 1.379.202 2.3981 20.651.64.7 1.28 1.595.028.688 3.848-2.339 4.695.566 49433590.39.6780.920.6781.85501.338-0.012 2419-01220.7470.2680.18.58.688.4820.1910.19 00221217C22 6.4840.5222122 clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-90ext-white tracking-wider uppercase mb-4             Quick Links
            </h3     <ul className="space-y-2>
              <li>
                <Link href={ROUTES.HOME} className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.DASHBOARD} className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href=[object Object]ROUTES.ONBOARDING} className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-90ext-white tracking-wider uppercase mb-4           Support
            </h3     <ul className="space-y-2>
              <li>
                <a href="#" className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-60dark:text-gray-300over:text-gray-90k:hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8rder-t border-gray-200 dark:border-gray-700      <p className="text-center text-gray-40dark:text-gray-50>            © {new Date().getFullYear()} Lynqup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 