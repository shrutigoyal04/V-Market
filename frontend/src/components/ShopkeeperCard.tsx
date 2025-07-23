// frontend/src/components/ShopkeeperCard.tsx
import React from 'react';
import { ShopkeeperData } from '@/api/shopkeepers.api'; // Assuming ShopkeeperData is defined here

interface ShopkeeperCardProps {
  shopkeeper: ShopkeeperData;
  onClick: (id: string) => void;
}

const ShopkeeperCard: React.FC<ShopkeeperCardProps> = ({ shopkeeper, onClick }) => {
  return (
    <div
      className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white cursor-pointer"
      onClick={() => onClick(shopkeeper.id)}
    >
      <h2 className="text-xl font-semibold mb-1">{shopkeeper.shopName}</h2>
      <p className="text-gray-600">Email: {shopkeeper.email}</p>
      <p className="text-gray-500">Address: {shopkeeper.address}</p>
      {shopkeeper.phone && <p className="text-gray-500">Phone: {shopkeeper.phone}</p>}
    </div>
  );
};

export default ShopkeeperCard;
