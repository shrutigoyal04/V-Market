'use client';

import { useEffect, useState } from 'react';
import productsApi from '@/api/products.api';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        console.log('API Response Data:', data);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Products</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found. Please add some.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white"
            >
              <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-green-700 font-medium">₹{product.price}</p>
              <p className="text-sm">Quantity: {product.quantity}</p>
              {product.description && (
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
