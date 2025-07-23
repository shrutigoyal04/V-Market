'use client';

import productsApi from '@/api/products.api';
import { useFetchData } from '@/hooks/useFetchData'; // Import useFetchData
import ReadOnlyProductCard from '@/components/ReadOnlyProductCard'; // Import ReadOnlyProductCard

export default function ProductsPage() {
  // Use useFetchData to manage product fetching
  const { data: products, loading, error } = useFetchData(productsApi.getAll);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(products) && products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(products) && products.map((product) => (
            <ReadOnlyProductCard // Use the reusable ReadOnlyProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
