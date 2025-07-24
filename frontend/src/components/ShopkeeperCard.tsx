// frontend/src/components/ShopkeeperCard.tsx
import React from 'react';
import { ShopkeeperData } from '@/api/shopkeepers.api';

interface ShopkeeperCardProps {
  shopkeeper: ShopkeeperData;
  onClick: (id: string) => void;
}

const ShopkeeperCard: React.FC<ShopkeeperCardProps> = ({ shopkeeper, onClick }) => {
  return (
    <div
      // Enhanced card styling: similar to ProductCard and ReadOnlyProductCard
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white cursor-pointer flex flex-col h-full"
      onClick={() => onClick(shopkeeper.id)}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
        {shopkeeper.shopName}
      </h2> {/* Larger, bolder title */}
      <p className="text-base text-gray-700 mb-1">
        <span className="font-semibold">Email:</span> {shopkeeper.email}
      </p>
      <p className="text-base text-gray-700 mb-1 flex-grow">
        <span className="font-semibold">Address:</span> {shopkeeper.address}
      </p> {/* Flex-grow to push phone to bottom if present */}
      {shopkeeper.phone && (
        <p className="text-base text-gray-700 mt-2">
          <span className="font-semibold">Phone:</span> {shopkeeper.phone}
        </p>
      )}
    </div>
  );
};

export default ShopkeeperCard;
