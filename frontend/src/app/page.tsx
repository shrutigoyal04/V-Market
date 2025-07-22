'use client';

import { useEffect, useState } from 'react';
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [shopkeepers, setShopkeepers] = useState<ShopkeeperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShopkeepers = async () => {
      try {
        const data = await shopkeepersApi.getAll();
        setShopkeepers(data);
      } catch (err: any) {
        console.error('Failed to fetch shopkeepers:', err);
        setError(err?.response?.data?.message || 'Failed to load shops.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopkeepers();
  }, []); // Empty dependency array means it runs once on mount

  const handleViewShop = (shopkeeperId: string) => {
    router.push(`/shop/${shopkeeperId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Shops</h1>

      {loading ? (
        <p className="text-gray-600">Loading shops...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(shopkeepers) && shopkeepers.length === 0 ? (
        <p className="text-gray-500">No shops found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(shopkeepers) && shopkeepers.map((shopkeeper) => (
            <div
              key={shopkeeper.id}
              className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white cursor-pointer"
              onClick={() => handleViewShop(shopkeeper.id)}
            >
              <h2 className="text-xl font-semibold mb-1">{shopkeeper.shopName}</h2>
              <p className="text-gray-600">Email: {shopkeeper.email}</p>
              <p className="text-gray-500">Address: {shopkeeper.address}</p>
              {shopkeeper.phone && <p className="text-gray-500">Phone: {shopkeeper.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
