// frontend/src/hooks/useAuthUser.ts
'use client';

import { useState, useEffect } from 'react';
import authApi from '@/api/auth.api'; // Assuming you have authApi
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

interface AuthUser {
  shopkeeperId: string;
  email: string;
  // Add other profile details you want to expose from the backend
}

interface UseAuthUserResult {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuthUser = (): UseAuthUserResult => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      console.log('useAuthUser: Initial token read from cookie:', token ? 'exists' : 'does NOT exist', token); // LOG 1

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
        console.log('useAuthUser: Attempting to fetch profile...'); // LOG 2
        const profile = await authApi.getProfile();
        console.log('useAuthUser: Profile fetched from API:', profile); // LOG 3
        
        // --- THE CRITICAL FIX IS HERE ---
        // Change profile.id to profile.shopkeeperId
        setUser({ shopkeeperId: profile.shopkeeperId, email: profile.email });
        console.log('useAuthUser: User state set to:', { shopkeeperId: profile.shopkeeperId, email: profile.email });
        // --- END CRITICAL FIX ---

      } catch (err: any) {
        console.error('useAuthUser: Failed to fetch user profile:', err); // LOG 5
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

    fetchUser();
  }, [router, pathname]); // Keep existing dependencies

  console.log('useAuthUser: Current return state - user:', user, 'loading:', loading); // LOG 6 (renders on every render)

  return { user, loading, error, isAuthenticated: !!user };
};