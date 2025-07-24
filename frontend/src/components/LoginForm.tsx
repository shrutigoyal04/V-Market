'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/api/auth.api';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import Link from 'next/link'; // Import Link for navigation to register

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setApiError('');
    setLoading(true);

    const { email, password } = data;

    try {
      Cookies.remove('token');
      const { access_token } = await authApi.login({ email, password });

      Cookies.set('token', access_token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.message || 'Login failed'); // Using err.message directly from Error object
    } finally {
      setLoading(false);
    }
  };

  return (
    // Enhanced outer container for a card-like appearance
    <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {/* Removed the 'Or register a new shop' from here */}
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{apiError}</div>
          </div>
        )}
        <div className="space-y-4"> {/* Changed from -space-y-px for better spacing between fields */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      {/* Moved the registration link here, below the form */}
      <div className="text-center text-sm mt-4">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
