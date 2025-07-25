'use client';

import productsApi from '@/api/products.api';
import { useFetchData } from '@/hooks/useFetchData';
import ReadOnlyProductCard from '@/components/ReadOnlyProductCard';
import React, { useState, useMemo } from 'react'; // Import useState and useMemo

export default function ProductsPage() {
  const { data: products, loading, error } = useFetchData(productsApi.getAll);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  // Memoize the filtered products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search description too
      product.shopkeeper?.shopName.toLowerCase().includes(searchTerm.toLowerCase()) // Search by shop name
    );
  }, [products, searchTerm]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Search Input Field */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product name, description, or shop name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
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
