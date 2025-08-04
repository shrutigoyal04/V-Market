// frontend/src/components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useNotifications } from '@/hooks/useNotifications'; // Import useNotifications

const Navbar: React.FC = () => {
  const { user, loading: userLoading } = useAuthUser();
  const { unreadCount, markAllNotificationsAsRead } = useNotifications(user?.shopkeeperId || null); // Use the hook
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  // Render on client side, regardless of login/register pages
  // The content inside will change based on user authentication status
  if (!isClient || userLoading) {
    return null; // Still hide while client-side hydration or user data loading
  }

  return (
    <nav className="bg-indigo-950 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-200">
          V-Market
        </Link>
        <div className="flex space-x-6 items-center">
          {user ? (
            // Authenticated Links
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    router.push('/notifications'); // Navigate to a notifications page (if you create one)
                    // Or, you could open a dropdown here
                    markAllNotificationsAsRead(); // Optionally mark all as read when bell is clicked
                  }}
                  className="relative p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-800"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <Link href="/" className="hover:text-gray-200 transition duration-200">
                All Shops
              </Link>
              <Link href="/products" className="hover:text-gray-200 transition duration-200">
                All Products
              </Link>
              <Link href="/dashboard" className="hover:text-gray-200 transition duration-200">
                Dashboard
              </Link>
              <Link href="/requests" className="hover:text-gray-200 transition duration-200">
                Product Requests
              </Link>
              <Link href="/transfer-history" className="hover:text-gray-200 transition duration-200">
                Transfer History
              </Link>
              <Link href="/profile" className="hover:text-gray-200 transition duration-200">
                Profile
              </Link>
              <span className="text-indigo-100 text-sm italic">
                Welcome to {user.shopName}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-md transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            // Unauthenticated Links
            <>
              <Link href="/" className="hover:text-gray-200 transition duration-200">
                All Shops
              </Link>
              <Link href="/login" className="hover:text-gray-200 transition duration-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-200 transition duration-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;