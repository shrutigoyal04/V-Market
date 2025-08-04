'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/api/auth.api';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import z from zod
import Cookies from 'js-cookie'; // Import Cookies

// Define the Zod schema for registration form validation
const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  shopName: z.string().min(3, 'Shop Name must be at least 3 characters').min(1, 'Shop Name is required'),
  address: z.string().min(5, 'Address must be at least 5 characters').min(1, 'Address is required'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format').optional().or(z.literal('')), // Optional phone number with regex, allows empty string
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Path of the error
});

// Infer the type from the schema
type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({ // Specify the type for useForm
    resolver: zodResolver(registerSchema), // Integrate Zod resolver
  });


  const onSubmit = async (data: RegisterFormInputs) => {
    setApiError('');
    setLoading(true);

    const { email, password, shopName, address, phone } = data;

    try {
      // 1. Register the user
      await authApi.register({
        email,
        password,
        shopName,
        address,
        phone: phone || undefined,
      });

      // 2. Automatically log in the user after successful registration
      const { access_token } = await authApi.login({ email, password });

      // 3. Store the token
      Cookies.set('token', access_token, { expires: 7, secure: process.env.NODE_ENV === 'production' });

      // 4. Redirect to the dashboard
      router.push('/dashboard');

      // Removed alert message as redirection is immediate
      // alert('Registration successful! Please log in with your new credentials.');
      // router.push('/login'); // This line will be removed
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please try again.'); // Updated error message for clarity
    } finally {
      setLoading(false);
    }
  };

  return (
    // Enhanced outer container for a card-like appearance
    <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Register your shop
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate> {/* Added noValidate */}
        {apiError && ( // Display API errors
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{apiError}</div>
          </div>
        )}
        <div className="space-y-4"> {/* Changed from -space-y-px for better spacing between fields */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email address:</label> {/* Changed label */}
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label> {/* Changed label */}
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label> {/* Changed label */}
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="shopName" className="block text-gray-700 text-sm font-bold mb-2">Shop Name:</label> {/* Changed label */}
            <input
              id="shopName"
              type="text"
              autoComplete="organization"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('shopName')}
            />
            {errors.shopName && (
              <p className="mt-1 text-sm text-red-600">{errors.shopName.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Shop Address:</label> {/* Changed label */}
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('address')}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone (optional):</label> {/* Changed label and added (optional) */}
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              // Removed placeholder
              {...register('phone')}
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
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      {/* Moved the sign-in link here, similar to LoginForm */}
      <div className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-900 hover:text-indigo-500">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
