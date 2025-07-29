'use client';

import { useRouter } from 'next/navigation';
import shopkeepersApi from '@/api/shopkeepers.api';
import { useFetchData } from '@/hooks/useFetchData';
import ShopkeeperCard from '@/components/ShopkeeperCard';
import React, { useState, useMemo, useCallback } from 'react';
import PaginationControls from '@/components/PaginationControls';
import { normalizeString } from '@/lib/searchUtils';

export default function HomePage() {
  const router = useRouter();

  const fetchShopkeepersPaginatedAndSearched = useCallback((page: number, limit: number, search: string) => {
    // Apply normalizeString here, just before the API call
    const normalizedSearch = normalizeString(search);
    return shopkeepersApi.getAll(page, limit, normalizedSearch);
  }, []);

  const {
    data: shopkeepers,
    total,
    loading,
    error,
    currentPage,
    itemsPerPage,
    searchTerm,
    setPage,
    setItemsPerPage,
    setSearchTerm,
  } = useFetchData(fetchShopkeepersPaginatedAndSearched, [], 10);

  // No more client-side filtering; shopkeepers from useFetchData are already paginated and searched by backend.
  const displayedShopkeepers = shopkeepers;

  const handleViewShop = (shopkeeperId: string) => {
    router.push(`/shop/${shopkeeperId}`);
  };

  const totalPages = total !== null ? Math.ceil(total / itemsPerPage) : 0;

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-200">All Shops</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by shop name or email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Store the raw input value
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-xl py-20">Loading shops...</p>
      ) : error ? (
        <div className="text-red-600 text-center py-20">
          <p className="text-xl font-medium mb-2">Error loading shops:</p>
          <p>{error}</p>
        </div>
      ) : Array.isArray(displayedShopkeepers) && displayedShopkeepers.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No shops found matching your search criteria.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.isArray(displayedShopkeepers) && displayedShopkeepers.map((shopkeeper) => (
              <ShopkeeperCard
                key={shopkeeper.id}
                shopkeeper={shopkeeper}
                onClick={handleViewShop}
              />
            ))}
          </div>
          {total !== null && total > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={total}
            />
          )}
        </>
      )}
    </div>
  );
}
