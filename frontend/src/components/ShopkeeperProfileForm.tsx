'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShopkeeperData } from '../api/shopkeepers.api';
import { AuthUser } from '../hooks/useAuthUser';
import shopkeepersApi from '../api/shopkeepers.api';

// Define the schema for updating a shopkeeper, making all fields optional
const updateShopkeeperSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  shopName: z.string().min(3, 'Shop name must be at least 3 characters').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format').optional().or(z.literal('')),
}).partial(); // Make all fields optional for partial updates

type UpdateShopkeeperFormData = z.infer<typeof updateShopkeeperSchema>;

interface ShopkeeperProfileFormProps {
  onUpdateSuccess: () => void;
  user: AuthUser | null;
}

const ShopkeeperProfileForm: React.FC<ShopkeeperProfileFormProps> = ({ onUpdateSuccess, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateShopkeeperFormData>({
    resolver: zodResolver(updateShopkeeperSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        shopName: user.shopName || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateShopkeeperFormData) => {
    if (!user?.shopkeeperId) {
      alert('User not authenticated or shopkeeper ID not found.');
      return;
    }

    try {
      // Filter out empty strings if the backend expects undefined for optional fields
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '')
      );
      
      await shopkeepersApi.updateShopkeeper(user.shopkeeperId, filteredData);
      alert('Profile updated successfully!');
      // The parent component (ProfilePage) is responsible for re-fetching user data
      // after a successful update, as it owns the 'user' state.
      onUpdateSuccess();
    } catch (error: any) {
      console.error('Profile update failed:', error);
      alert('Profile update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!user) {
    return <div>Loading profile data...</div>; // Or a more elaborate loading state/spinner
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
        <input
          type="text"
          id="shopName"
          {...register('shopName')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.shopName && <p className="mt-1 text-sm text-red-600">{errors.shopName.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
        <input
          type="text"
          id="phone"
          {...register('phone')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default ShopkeeperProfileForm; 