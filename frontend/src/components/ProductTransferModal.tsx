// frontend/src/components/ProductTransferModal.tsx
import React, { useEffect } from 'react'; // Added useEffect
import { Product } from '@/types/product';
import { ShopkeeperData } from '@/api/shopkeepers.api';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import z from zod

interface ProductTransferModalProps {
  show: boolean;
  product: Product | null;
  otherShopkeepers: ShopkeeperData[];
  error: string | null;
  loading: boolean;
  // Renamed from onSendRequest and changed signature to receive validated data
  onSubmit: (data: { quantity: number; targetShopkeeperId: string }) => Promise<void>;
  onClose: () => void;
}

const ProductTransferModal: React.FC<ProductTransferModalProps> = ({
  show,
  product,
  otherShopkeepers,
  error,
  loading,
  onSubmit, // New onSubmit prop
  onClose,
}) => {
  // Define the Zod schema for product transfer validation dynamically
  const transferSchema = z.object({
    quantity: z.preprocess(
      (val) => Number(val),
      z.number()
        .min(1, 'Quantity must be at least 1')
        .max(product?.quantity || 0, `Quantity cannot exceed available stock (${product?.quantity})`)
        .refine((val) => !isNaN(val), 'Quantity must be a number')
    ),
    targetShopkeeperId: z.string().min(1, 'Please select a shop to transfer to'),
  });

  // Infer the type for the form inputs
  type TransferFormInputs = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset form when product changes or modal closes
  } = useForm<TransferFormInputs>({
    resolver: zodResolver(transferSchema), // Integrate Zod resolver
    defaultValues: {
      quantity: 1, // Default quantity
      targetShopkeeperId: '', // Default empty selection
    },
  });

  // Reset form when modal opens with a new product or closes
  useEffect(() => {
    if (show && product) {
      reset({
        quantity: 1,
        targetShopkeeperId: '',
      });
    }
  }, [show, product, reset]);


  const handleFormSubmit = async (data: TransferFormInputs) => {
    await onSubmit(data);
  };

  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200"> {/* Updated container style */}
        <h2 className="mt-2 text-center text-2xl font-bold mb-4 text-gray-900">Transfer Product: {product.name}</h2> {/* Adjusted heading style */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8 space-y-6"> {/* Form wrapper with space-y-6 */}
          <div className="space-y-4"> {/* Grouping for input fields */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity (Available: {product.quantity}):</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity')}
                min="1"
                max={product.quantity}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Updated input style
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="targetShopkeeper" className="block text-gray-700 text-sm font-bold mb-2">Transfer to Shop:</label>
              <select
                id="targetShopkeeper"
                {...register('targetShopkeeperId')}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Updated select style
              >
                <option value="">Select a shop</option>
                {otherShopkeepers.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.shopName} ({shop.email})</option>
                ))}
              </select>
              {errors.targetShopkeeperId && (
                <p className="mt-1 text-sm text-red-600">{errors.targetShopkeeperId.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200" // Adjusted cancel button style
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // Updated submit button style
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductTransferModal;