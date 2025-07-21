// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import productsApi from '@/api/products.api';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ShopkeeperDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShopkeeperId, setCurrentShopkeeperId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShopkeeperProducts = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        console.log('Fetching shopkeeper products...');
        const response = await productsApi.getShopkeeperProducts();
        console.log('API Response:', response);
        console.log('Products from API:', response.products);

        setProducts(response.products || []);
        setCurrentShopkeeperId(response.shopkeeperId || null);

      } catch (err: any) {
        console.error('Failed to fetch shopkeeper products:', err);
        if (err.response?.data) {
          console.error('Error Response Data:', err.response.data);
        }
        setError(err?.response?.data?.message || 'Failed to load products. Please ensure you are logged in.');
        if (err.response?.status === 401) {
          Cookies.remove('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShopkeeperProducts();
  }, [router]);

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  // Ensure this function is correctly defined
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await productsApi.delete(id);
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        setError(err?.response?.data?.message || 'Failed to delete product.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Shopkeeper Dashboard</h1>

      <button
        onClick={handleAddNewProduct}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Add New Product
      </button>

      {loading ? (
        <p className="text-gray-600">Loading your products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {Array.isArray(products) && products.length === 0 ? (
            <p className="text-gray-500">You have no products listed. Click "Add New Product" to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(products) && products.map((product) => (
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
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
                  )}
                  <div className="flex space-x-2 mt-4">
                    {/* Ensure product.shopkeeper exists before accessing its id */}
                    {currentShopkeeperId && product.shopkeeper && currentShopkeeperId === product.shopkeeper.id && (
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                    )}
                    {/* Ensure product.shopkeeper exists before accessing its id */}
                    {currentShopkeeperId && product.shopkeeper && currentShopkeeperId === product.shopkeeper.id && (
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
