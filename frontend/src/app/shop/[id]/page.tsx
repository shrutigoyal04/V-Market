// frontend/src/app/shop/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import productsApi from '@/api/products.api';
import shopkeepersApi from '@/api/shopkeepers.api';
import { useFetchData } from '@/hooks/useFetchData';
import ReadOnlyProductCard from '@/components/ReadOnlyProductCard';
import { useCallback } from 'react'; // Import useCallback

export default function ShopDetailsPage() {
  const params = useParams();
  const shopkeeperId = params.id as string;

  // Memoize the fetch functions using useCallback
  const fetchShopkeeper = useCallback(
    () => shopkeepersApi.getById(shopkeeperId),
    [shopkeeperId] // Dependency: shopkeeperId
  );

  const fetchProductsForShop = useCallback(
    () => productsApi.getProductsByShopId(shopkeeperId),
    [shopkeeperId] // Dependency: shopkeeperId
  );

  // Use the memoized fetch functions with useFetchData
  const { data: shopkeeper, loading: shopkeeperLoading, error: shopkeeperError } = useFetchData(
    fetchShopkeeper,
    [shopkeeperId] // Dependencies for useFetchData's internal useEffect
  );

  const { data: products, loading: productsLoading, error: productsError } = useFetchData(
    fetchProductsForShop,
    [shopkeeperId] // Dependencies for useFetchData's internal useEffect
  );

  const loading = shopkeeperLoading || productsLoading;
  const error = shopkeeperError || productsError;

  if (loading) {
    return <p className="p-6 text-gray-600">Loading shop details...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>;
  }

  if (!shopkeeper) {
    return <p className="p-6 text-gray-500">Shop not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{shopkeeper.shopName}</h1>
      <p className="text-gray-700 mb-6">
        Email: {shopkeeper.email} | Address: {shopkeeper.address} {shopkeeper.phone && `| Phone: ${shopkeeper.phone}`}
      </p>

      <h2 className="text-2xl font-semibold mb-4">Products from {shopkeeper.shopName}</h2>

      {Array.isArray(products) && products.length === 0 ? (
        <p className="text-gray-500">This shop has no products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(products) && products.map((product) => (
            <ReadOnlyProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
