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
      // Enhanced card styling:
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full"
    >
      {product.imageUrl && (
        <div className="mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg" // Larger image, more rounded
          />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h2> {/* Larger, bolder title */}
      <p className="text-xl font-semibold text-green-700 mb-2">₹{product.price}</p> {/* Larger price */}
      <p className="text-base text-gray-600 mb-1">Quantity: <span className="font-medium">{product.quantity}</span></p> {/* Better quantity visibility */}
      {product.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-3 flex-grow">{product.description}</p> // Added line-clamp and flex-grow
      )}
      
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100"> {/* Flex wrap for buttons, increased margin-top, border top */}
        {isOwner && (
          <>
            <button
              onClick={() => onEdit(product.id)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm font-medium shadow-sm flex-1 min-w-[80px]" // Consistent button style
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium shadow-sm flex-1 min-w-[80px]" // Consistent button style
            >
              Delete
            </button>
            <button
              onClick={() => onTransfer(product)}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 text-sm font-medium shadow-sm flex-1 min-w-[80px]" // Consistent button style
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
