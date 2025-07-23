'use client';

import RegisterForm from '@/components/RegisterForm'; // Import the new Register Form component

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm /> {/* Render the RegisterForm component */}
    </div>
  );
}