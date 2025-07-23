'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import productsApi from '@/api/products.api';
import { useProductForm } from '@/hooks/useProductForm'; // Import the custom hook
import ProductForm from '@/components/ProductForm'; // Import the new component
import { Product } from '@/types/product'; // Import Product type for initial fetch

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize useProductForm with an empty onSubmit for now, will redefine it
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    setFormData, // Need to expose setFormData to populate from fetched data
    setLoading, // Need to expose setLoading for initial fetch
    setError, // Need to expose setError for initial fetch
  } = useProductForm({ onSubmit: async () => {}, redirectPath: '/dashboard' }); // Provide a dummy onSubmit initially

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is missing.');
        setInitialLoading(false);
        return;
      }
      try {
        setLoading(true); // Set hook's loading state for initial fetch
        const product: Product = await productsApi.getById(productId);
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description || '', // Ensure it's a string
          quantity: product.quantity.toString(),
          imageUrl: product.imageUrl || '',
        });
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error('Failed to load product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false); // Set hook's loading state back to false
        setInitialLoading(false);
      }
    };

    fetchProduct();
  }, [productId, setFormData, setLoading, setError]); // Add setFormData, setLoading, setError to dependencies

  // Define the actual onSubmit handler for updating the product
  const handleUpdateProduct = async (data: any) => { // data will be ProductFormData
    await productsApi.update(productId, {
      name: data.name,
      price: parseFloat(data.price),
      description: data.description || undefined,
      quantity: parseInt(data.quantity),
      imageUrl: data.imageUrl || undefined,
    });
    router.push('/dashboard'); // Redirect to dashboard after update
  };

  // Override the handleSubmit from the hook with the actual update logic
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Use hook's setLoading
    setError(null); // Use hook's setError
    try {
      await handleUpdateProduct(formData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  if (initialLoading) return <p className="text-center mt-10">Loading product for edit...</p>;


  return (
    <ProductForm
      title="Edit Product"
      buttonText="Update Product"
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleFormSubmit} // Use the local handleFormSubmit
      loading={loading}
      error={error}
    />
  );
}
