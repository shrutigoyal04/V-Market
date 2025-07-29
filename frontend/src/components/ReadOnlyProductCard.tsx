// frontend/src/components/ReadOnlyProductCard.tsx
import React from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';

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
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full cursor-pointer"
    >
      {/* Consistent image area, with a creative fallback placeholder */}
      <div className="mb-4 w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover" // Ensure image fills container
          />
        ) : (
          // Custom placeholder: first letter of product name
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-6xl font-bold">
            {product.name?.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      {/* Product details - This section will grow to fill space */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h3>
        <p className="text-xl font-semibold text-green-700 mb-2">₹{product.price}</p>
        <p className="text-base text-gray-600 mb-1">Quantity: <span className="font-medium">{product.quantity}</span></p>
        {product.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">{product.description}</p>
        )}
        {/* Add an empty div with flex-grow here to push content up if description is short or missing */}
        {!product.description && <div className="flex-grow"></div>}
      </div>
      
      {/* Information about the shopkeeper - This section will stick to the bottom */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Shop:</span> {product.shopkeeper.shopName}
        </p>
      </div>
    </Link>
  );
};

export default ReadOnlyProductCard;
