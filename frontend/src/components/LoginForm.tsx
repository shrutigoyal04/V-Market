'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/api/auth.api';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form'; // Import useForm

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState(''); // Renamed to avoid conflict with react-hook-form 'errors'
  const [loading, setLoading] = useState(false);

  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors }, // Destructure errors from formState
  } = useForm();

  // Modified handleSubmit function to use react-hook-form's handleSubmit
  const onSubmit = async (data: any) => {
    setApiError('');
    setLoading(true);

    const { email, password } = data; // Data is now directly from react-hook-form

    try {
      Cookies.remove('token');
      const { access_token } = await authApi.login({ email, password });

      Cookies.set('token', access_token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Login failed'); // Using apiError for server-side errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate> {/* Added noValidate */}
        {apiError && ( // Display API errors
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{apiError}</div>
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              id="email" // Keep id for accessibility
              type="email"
              autoComplete="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            <input
              id="password" // Keep id for accessibility
              type="password"
              autoComplete="current-password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
