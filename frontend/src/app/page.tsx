'use client';

import { useRouter } from 'next/navigation';
import shopkeepersApi from '@/api/shopkeepers.api'; // Import your shopkeepers API
import { useFetchData } from '@/hooks/useFetchData'; // Import the new generic hook
import ShopkeeperCard from '@/components/ShopkeeperCard'; // Import the new component

export default function HomePage() {
  const router = useRouter();

  // Use the generic useFetchData hook
  const { data: shopkeepers, loading, error } = useFetchData(shopkeepersApi.getAll);

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
