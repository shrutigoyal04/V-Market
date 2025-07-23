'use client';

import { useRouter } from 'next/navigation';
import productsApi from '@/api/products.api';
import { useProductForm } from '@/hooks/useProductForm'; // Import the custom hook
import ProductForm from '@/components/ProductForm'; // Import the new component

export default function NewProductPage() {
  const router = useRouter();

  const handleCreateProduct = async (data: any) => { // data will be ProductFormData
    await productsApi.create({
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      quantity: parseInt(data.quantity),
      imageUrl: data.imageUrl || undefined,
    });
    router.push('/dashboard'); // Redirect to dashboard after creation
  };

  const { formData, handleChange, handleSubmit, loading, error } = useProductForm({
    onSubmit: handleCreateProduct,
    redirectPath: '/dashboard', // The hook won't redirect, the component will.
  });

  return (
    <ProductForm
      title="Add New Product"
      buttonText="Create Product"
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
