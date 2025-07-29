// frontend/src/app/shop/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import productsApi from '@/api/products.api';
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api'; // Import ShopkeeperData
import ReadOnlyProductCard from '@/components/ReadOnlyProductCard';
import { Product } from '@/types/product'; // Import Product type

export default function ShopDetailsPage() {
  const params = useParams();
  const shopkeeperId = params.id as string;

  const [shopkeeper, setShopkeeper] = useState<ShopkeeperData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch shopkeeper details
        const fetchedShopkeeper = await shopkeepersApi.getById(shopkeeperId);
        setShopkeeper(fetchedShopkeeper);

        // Fetch products for the shop
        const fetchedProducts = await productsApi.getProductsByShopId(shopkeeperId);
        setProducts(fetchedProducts);

      } catch (err: any) {
        console.error('Failed to fetch shop details:', err);
        setError(err?.response?.data?.message || 'Failed to load shop details.');
      } finally {
        setLoading(false);
      }
    };

    if (shopkeeperId) { // Only fetch if shopkeeperId is available
      fetchData();
    }
  }, [shopkeeperId]);

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
