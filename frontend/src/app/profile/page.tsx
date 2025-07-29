'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '../../hooks/useAuthUser';
import ShopkeeperProfileForm from '../../components/ShopkeeperProfileForm';

const ProfilePage: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [loading, isAuthenticated, router]);

  const handleUpdateSuccess = () => {
    // Optionally display a success message or redirect
    console.log('Profile updated successfully, onUpdateSuccess callback fired!');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading profile...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-600">Failed to load profile. Please log in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>
        {/* Pass the 'user' object from useAuthUser directly to the form */}
        <ShopkeeperProfileForm onUpdateSuccess={handleUpdateSuccess} user={user} />
      </div>
    </div>
  );
};

export default ProfilePage; 