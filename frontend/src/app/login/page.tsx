'use client';

import LoginForm from '@/components/LoginForm'; // Import the new Login Form component

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm /> {/* Render the LoginForm component */}
    </div>
  );
}