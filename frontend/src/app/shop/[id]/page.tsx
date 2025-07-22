// frontend/src/app/shop/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import productsApi from '@/api/products.api';
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api'; // Import shopkeepersApi
import { Product } from '@/types/product';

export default function ShopDetailsPage() {
  const params = useParams();
  const shopkeeperId = params.id as string; // Get shopkeeper ID from dynamic route

  const [shopkeeper, setShopkeeper] = useState<ShopkeeperData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!shopkeeperId) {
        setError('Shopkeeper ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // Fetch shopkeeper details
        const shopkeeperData = await shopkeepersApi.getById(shopkeeperId);
        setShopkeeper(shopkeeperData);

        // Fetch products for this shopkeeper
        const productsData = await productsApi.getProductsByShopId(shopkeeperId);
        setProducts(productsData || []); // Ensure it's an array
      } catch (err: any) {
        console.error('Failed to fetch shop details or products:', err);
        setError(err?.response?.data?.message || 'Failed to load shop details and products.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopkeeperId]); // Re-run effect if shopkeeperId changes

  if (loading) {
    return <div className="p-6 text-gray-600">Loading shop details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!shopkeeper) {
    return <div className="p-6 text-gray-500">Shop not found.</div>;
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
            <div
              key={product.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-green-700 font-medium">₹{product.price}</p>
              <p className="text-sm">Quantity: {product.quantity}</p>
              {product.description && (
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              )}
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
