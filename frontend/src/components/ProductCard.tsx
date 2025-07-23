import React from 'react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  currentShopkeeperId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTransfer: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentShopkeeperId,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const isOwner = currentShopkeeperId && product.shopkeeper && currentShopkeeperId === product.shopkeeper.id;

  return (
    <div
      key={product.id}
      className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white"
    >
      <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
      <p className="text-green-700 font-medium">₹{product.price}</p>
      <p className="text-sm">Quantity: {product.quantity}</p>
      {product.description && (
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
      )}
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
      )}
      <div className="flex space-x-2 mt-4">
        {isOwner && (
          <>
            <button
              onClick={() => onEdit(product.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => onTransfer(product)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
