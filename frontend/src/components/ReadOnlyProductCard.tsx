// frontend/src/components/ReadOnlyProductCard.tsx
import React from 'react';
import { Product } from '@/types/product';
import Link from 'next/link'; // Import Link

interface ReadOnlyProductCardProps {
  product: Product;
}

const ReadOnlyProductCard: React.FC<ReadOnlyProductCardProps> = ({ product }) => {
  return (
    // Wrap the entire card content with a Link component
    <Link
      href={`/shop/${product.shopkeeper.id}`} // Navigate to the shop details page
      key={product.id} // Keep key on the outermost element
      // Enhanced card styling, similar to ProductCard, now applied to Link
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full cursor-pointer" // Add cursor-pointer
    >
      {product.imageUrl && (
        <div className="mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h3>
      <p className="text-xl font-semibold text-green-700 mb-2">₹{product.price}</p>
      <p className="text-base text-gray-600 mb-1">Quantity: <span className="font-medium">{product.quantity}</span></p>
      {product.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-3 flex-grow">{product.description}</p>
      )}
      {/* Information about the shopkeeper, relevant when clicking from All Products */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Shop:</span> {product.shopkeeper.shopName}
        </p>
      </div>
    </Link>
  );
};

export default ReadOnlyProductCard;
