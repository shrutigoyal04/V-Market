'use client';

import { useState, useEffect, useCallback } from 'react';
import productsApi from '@/api/products.api';
import { Product } from '@/types/product';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface UseProductManagementResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentShopkeeperId: string | null;
  fetchProducts: () => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
}

export const useProductManagement = (): UseProductManagementResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShopkeeperId, setCurrentShopkeeperId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await productsApi.getShopkeeperProducts();
      setProducts(response.products || []);
      setCurrentShopkeeperId(response.shopkeeperId || null);
    } catch (err: any) {
      console.error('Failed to fetch shopkeeper products:', err);
      setError(err?.response?.data?.message || 'Failed to load products. Please ensure you are logged in.');
      if (err.response?.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Dependency on fetchProducts to run once on mount

  const handleDeleteProduct = useCallback(async (id: string) => {
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
  }, []);

  return { products, loading, error, currentShopkeeperId, fetchProducts, handleDeleteProduct };
};