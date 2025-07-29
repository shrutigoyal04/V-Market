// frontend/src/hooks/useFetchData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the structure of a paginated response from the backend
interface PaginatedResponse<T> {
  products?: T[]; // For products endpoint
  shopkeepers?: T[]; // For shopkeepers endpoint
  items?: T[]; // Generic fallback if items are not nested in products/shopkeepers
  total: number;
}

// Update the result interface to include pagination state
interface UseFetchDataResult<T> {
  data: T[] | null; // Data for the current page (array of items)
  total: number | null; // Total count of all items
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string; // Add searchTerm to result interface
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchTerm: (term: string) => void; // Add setSearchTerm to result interface
  refetch: () => Promise<void>;
}

export const useFetchData = <T>(
  // fetchFunction now accepts page, limit, AND search term
  fetchFunction: (page: number, limit: number, search: string) => Promise<PaginatedResponse<T>>,
  deps: React.DependencyList = [],
  initialItemsPerPage: number = 10 // New optional parameter for initial items per page
): UseFetchDataResult<T> => {
  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage); // Use initialItemsPerPage
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(currentPage, itemsPerPage, searchTerm);
      const items = (result as any).products || (result as any).shopkeepers || result.items;
      setData(items || null);
      setTotal(result.total);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err?.response?.data?.message || 'Failed to load data.');
      setData(null);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, itemsPerPage, searchTerm, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page to 1 when itemsPerPage or searchTerm changes, but not when current page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  return {
    data,
    total,
    loading,
    error,
    currentPage,
    itemsPerPage,
    searchTerm,
    setPage: setCurrentPage,
    setItemsPerPage: (limit) => {
      setItemsPerPage(limit);
      // Reset page to 1 when items per page changes
      setCurrentPage(1);
    },
    setSearchTerm: (term) => {
      setSearchTerm(term);
      // Reset page to 1 when search term changes
      setCurrentPage(1);
    },
    refetch: fetchData,
  };
};
