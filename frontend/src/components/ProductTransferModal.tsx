// frontend/src/components/ProductTransferModal.tsx
import React from 'react';
import { Product } from '@/types/product';
import { ShopkeeperData } from '@/api/shopkeepers.api';

interface ProductTransferModalProps {
  show: boolean;
  product: Product | null;
  otherShopkeepers: ShopkeeperData[];
  quantity: number;
  targetShopkeeperId: string;
  error: string | null;
  loading: boolean;
  onQuantityChange: (quantity: number) => void;
  onTargetShopkeeperChange: (id: string) => void;
  onSendRequest: () => Promise<void>;
  onClose: () => void;
}

const ProductTransferModal: React.FC<ProductTransferModalProps> = ({
  show,
  product,
  otherShopkeepers,
  quantity,
  targetShopkeeperId,
  error,
  loading,
  onQuantityChange,
  onTargetShopkeeperChange,
  onSendRequest,
  onClose,
}) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Transfer Product: {product.name}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity (Available: {product.quantity}):</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={product.quantity}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="targetShopkeeper" className="block text-gray-700 text-sm font-bold mb-2">Transfer to Shop:</label>
          <select
            id="targetShopkeeper"
            value={targetShopkeeperId}
            onChange={(e) => onTargetShopkeeperChange(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a shop</option>
            {otherShopkeepers.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.shopName} ({shop.email})</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSendRequest}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTransferModal;