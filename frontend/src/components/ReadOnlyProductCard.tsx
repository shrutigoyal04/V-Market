// frontend/src/components/ReadOnlyProductCard.tsx
import React from 'react';
import { Product } from '@/types/product';

interface ReadOnlyProductCardProps {
  product: Product;
}

const ReadOnlyProductCard: React.FC<ReadOnlyProductCardProps> = ({ product }) => {
  return (
    <div
      key={product.id}
      className="border p-4 rounded-xl shadow-sm bg-white"
    >
      <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
      <p className="text-green-700 font-medium">₹{product.price}</p>
      <p className="text-sm">Quantity: {product.quantity}</p>
      {product.description && (
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
      )}
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
      )}
    </div>
  );
};

export default ReadOnlyProductCard;
