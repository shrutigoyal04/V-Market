'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/product';
import { ShopkeeperData } from '@/api/shopkeepers.api';
import ShopSearchInput from './ShopSearchInput'; // Import the new component
import { useProductTransferForm } from '@/hooks/useProductTransferForm';


interface ProductTransferModalProps {
  show: boolean;
  product: Product | null;
  otherShopkeepers: ShopkeeperData[];
  error: string | null;
  loading: boolean;
  onSubmit: (data: { quantity: number; targetShopkeeperId: string }) => Promise<boolean>; // Corrected to Promise<boolean>
  onClose: () => void;
}

// Define the schema for product transfer form validation
const transferSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1').int('Quantity must be an integer'),
  targetShopkeeperId: z.string().min(1, 'Please select a target shopkeeper.'),
});

type TransferFormData = z.infer<typeof transferSchema>;

const ProductTransferModal: React.FC<ProductTransferModalProps> = ({
  show,
  product,
  otherShopkeepers,
  error,
  loading,
  onSubmit,
  onClose,
}) => {
  // Use the new custom hook
  const {
    register,
    handleSubmit,
    errors,
    shopSearchTerm,
    isDropdownOpen,
    filteredShops,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleShopSelect,
    dropdownRef,
    inputRef,
  } = useProductTransferForm({ product, otherShopkeepers, showModal: show }); // Pass necessary props to the hook

  const handleFormSubmit = async (data: { quantity: number; targetShopkeeperId: string }) => {
    await onSubmit(data);
  };

  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-25 backdrop-blur-[1px] overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="mt-2 text-center text-2xl font-bold mb-4 text-gray-900">Transfer Product: {product.name}</h2>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity (Available: {product.quantity}):</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity', { valueAsNumber: true })} // Ensure quantity is treated as number
                min="1"
                max={product.quantity}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
            
            {/* Use the new ShopSearchInput component */}
            <ShopSearchInput
              label="Transfer to Shop:"
              searchTerm={shopSearchTerm}
              isDropdownOpen={isDropdownOpen}
              filteredShops={filteredShops}
              inputRef={inputRef}
              dropdownRef={dropdownRef}
              errors={errors}
              handleInputChange={handleInputChange}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              handleShopSelect={handleShopSelect}
            />

          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form> {/* Correctly closing the form tag */}
      </div>
    </div>
  );
};

export default ProductTransferModal;