'use client';

import { useRouter } from 'next/navigation';
import shopkeepersApi from '@/api/shopkeepers.api';
import { useFetchData } from '@/hooks/useFetchData';
import ShopkeeperCard from '@/components/ShopkeeperCard';
import React, { useState, useMemo } from 'react'; // Import useState and useMemo

export default function HomePage() {
  const router = useRouter();

  const { data: shopkeepers, loading, error } = useFetchData(shopkeepersApi.getAll);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  // Memoize the filtered shopkeepers to prevent re-rendering on every keystroke
  const filteredShopkeepers = useMemo(() => {
    if (!shopkeepers) return [];
    return shopkeepers.filter(shopkeeper =>
      shopkeeper.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shopkeeper.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shopkeepers, searchTerm]);

  const handleViewShop = (shopkeeperId: string) => {
    router.push(`/shop/${shopkeeperId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Shops</h1>

      {/* Search Input Field */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by shop name or email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading shops...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(filteredShopkeepers) && filteredShopkeepers.length === 0 ? (
        <p className="text-gray-500">No shops found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(filteredShopkeepers) && filteredShopkeepers.map((shopkeeper) => (
            <ShopkeeperCard
              key={shopkeeper.id}
              shopkeeper={shopkeeper}
              onClick={handleViewShop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
