// frontend/src/hooks/useFetchData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; // Function to manually refetch data
}

export const useFetchData = <T>(
  fetchFunction: () => Promise<T>, // Function that performs the API call
  deps: React.DependencyList = [] // Dependencies for useEffect
): UseFetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err?.response?.data?.message || 'Failed to load data.');
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, ...deps]); // Include deps for useCallback

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only re-run if fetchData function reference changes

  return { data, loading, error, refetch: fetchData };
};
