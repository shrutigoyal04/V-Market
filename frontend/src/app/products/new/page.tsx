'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import productsApi from '@/api/products.api';
import ProductForm from '@/components/ProductForm';
import { CreateProductDto, UpdateProductDto } from '@/types/product'; // Import UpdateProductDto as well

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Define the onSubmit handler for creating a new product
  // It now accepts the union type to satisfy ProductForm's onSubmit prop
  const handleCreateProduct = async (data: CreateProductDto | UpdateProductDto) => {
    setLoading(true);
    setApiError(null);
    try {
      // Cast data to CreateProductDto when calling productsApi.create
      await productsApi.create(data as CreateProductDto);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Failed to create product:', err);
      setApiError(err?.message || 'Something went wrong during product creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      title="Add New Product"
      buttonText="Create Product"
      onSubmit={handleCreateProduct}
      loading={loading}
      apiError={apiError}
      // No defaultValues needed for new product creation
    />
  );
}
