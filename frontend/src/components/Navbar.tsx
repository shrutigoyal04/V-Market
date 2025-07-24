// frontend/src/components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthUser } from '@/hooks/useAuthUser';

const Navbar: React.FC = () => {
  const { user, loading: userLoading } = useAuthUser();
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
              <Link href="/dashboard" className="hover:text-gray-200 transition duration-200">
                Dashboard
              </Link>
              <Link href="/products" className="hover:text-gray-200 transition duration-200">
                All Products
              </Link>
              <Link href="/requests" className="hover:text-gray-200 transition duration-200">
                Product Requests
              </Link>
              <Link href="/transfer-history" className="hover:text-gray-200 transition duration-200">
                Transfer History
              </Link>
              <Link href="/" className="hover:text-gray-200 transition duration-200">
                All Shops
              </Link> {/* Added "All Shops" link for logged-in users */}
              <span className="text-indigo-100 text-sm italic">
                Welcome, {user.email}!
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
              </Link> {/* Added "All Shops" link for unauthenticated users */}
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
