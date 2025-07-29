// frontend/src/hooks/useAuthUser.ts
'use client';

import { useState, useEffect } from 'react';
import authApi from '@/api/auth.api'; // Assuming you have authApi
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

export interface AuthUser { // Added 'export' keyword
  shopkeeperId: string; // Reverted to shopkeeperId
  email: string;
  shopName: string;
  address: string;
  phone?: string;
}

interface UseAuthUserResult {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  fetchAuthUser: () => Promise<void>;
}

export const useAuthUser = (): UseAuthUserResult => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchAuthUser = async () => {
    const token = Cookies.get('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      setError('No authentication token found.');
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        router.push('/login');
      }
      return;
    }

    try {
      const profile = await authApi.getProfile();
      // Map profile.id from backend (Shopkeeper entity) to shopkeeperId in AuthUser
      setUser({
        shopkeeperId: profile.id, // Map backend's 'id' to 'shopkeeperId'
        email: profile.email,
        shopName: profile.shopName,
        address: profile.address,
        phone: profile.phone,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load user profile.');
      setUser(null);
      if (err.response?.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, [router, pathname]);

  console.log('useAuthUser: Current return state - user:', user, 'loading:', loading);

  return { user, loading, error, isAuthenticated: !!user, fetchAuthUser };
};