// frontend/src/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthUser } from '@/hooks/useAuthUser'; // Import useAuthUser

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuthUser(); // Get auth status

  console.log('Navbar: Auth User State:', user, 'Loading:', loading); // LOG 7

  const handleLogout = () => {
    Cookies.remove('token'); // Clear the authentication token
    router.push('/login'); // Redirect to login page
    alert('You have been logged out.'); // Optional feedback
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          V-Market
        </Link>
        <div className="space-x-4">
          <Link href="/">All Shops</Link>
          <Link href="/products">All Products</Link>

          {loading ? (
            <span className="text-gray-400">Loading user...</span>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard">My Dashboard</Link>
              <Link href="/requests">My Requests</Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                Logout ({user?.email})
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
