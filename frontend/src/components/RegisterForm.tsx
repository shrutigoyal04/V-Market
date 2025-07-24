'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/api/auth.api';
import { useForm } from 'react-hook-form'; // Import useForm
import Link from 'next/link'; // Import Link for navigation to login

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState(''); // Renamed to avoid conflict with react-hook-form 'errors'
  const [loading, setLoading] = useState(false);

  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors }, // Destructure errors from formState
    watch // To watch password for confirmation validation
  } = useForm();

  const password = watch('password'); // Watch password field for confirmation

  // Modified handleSubmit function to use react-hook-form's handleSubmit
  const onSubmit = async (data: any) => {
    setApiError('');
    setLoading(true);

    const { email, password, shopName, address, phone } = data; // Data is now directly from react-hook-form

    try {
      // We still call register API to create the user on backend
      await authApi.register({
        email,
        password,
        shopName,
        address,
        phone: phone || undefined,
      });

      alert('Registration successful! Please log in with your new credentials.'); // Optional: provide feedback
      router.push('/login');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed'); // Using apiError for server-side errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register your shop
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
              id="email"
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
              id="password"
              type="password"
              autoComplete="new-password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
          <div>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
            )}
          </div>
          <div>
            <input
              id="shopName"
              type="text"
              autoComplete="organization"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Shop Name"
              {...register('shopName', {
                required: 'Shop Name is required',
                minLength: {
                  value: 3,
                  message: 'Shop Name must be at least 3 characters',
                },
              })}
            />
            {errors.shopName && (
              <p className="mt-1 text-sm text-red-600">{errors.shopName.message as string}</p>
            )}
          </div>
          <div>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Shop Address"
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 5,
                  message: 'Address must be at least 5 characters',
                },
              })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>
            )}
          </div>
          <div>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Phone (Optional)"
              {...register('phone', {
                pattern: {
                  value: /^\+?[0-9]{10,15}$/, // Basic phone number regex
                  message: 'Invalid phone number format',
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
        <div className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
