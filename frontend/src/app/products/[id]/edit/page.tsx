'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import productsApi from '@/api/products.api';
import ProductForm from '@/components/ProductForm'; // Import the new component
import { Product, UpdateProductDto } from '@/types/product'; // Import Product type for initial fetch and UpdateProductDto

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [productData, setProductData] = useState<Partial<Product> | null>(null); // State to hold fetched product data for default values
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null); // State for API errors in this page
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage form submission loading

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setApiError('Product ID is missing.');
        setInitialLoading(false);
        return;
      }
      try {
        setInitialLoading(true);
        const product: Product = await productsApi.getById(productId);
        setProductData(product); // Set the fetched product as default values for the form
        setApiError(null); // Clear any previous errors
      } catch (err: any) {
        console.error('Failed to load product details:', err);
        setApiError(err?.message || 'Failed to load product details.'); // Use err.message from new Error
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Define the actual onSubmit handler for updating the product,
  // this function will be passed to ProductForm
  const handleUpdateProduct = async (data: UpdateProductDto) => {
    setIsSubmitting(true);
    setApiError(null); // Clear previous API errors on new submission
    try {
      await productsApi.update(productId, data); // Directly use data from react-hook-form
      router.push('/dashboard'); // Redirect to dashboard after update
    } catch (err: any) {
      console.error('Failed to update product:', err);
      setApiError(err?.message || 'Something went wrong during update.'); // Use err.message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return <p className="text-center mt-10">Loading product for edit...</p>;
  }

  if (apiError && !productData) { // Display error if failed to load initial product and no data
    return (
      <div className="text-red-600 text-center py-8">
        <p>Error: {apiError}</p>
      </div>
    );
  }

  // Render ProductForm only if productData is available
  return productData ? (
    <ProductForm
      title="Edit Product"
      buttonText="Update Product"
      onSubmit={handleUpdateProduct} // Pass the onSubmit handler
      loading={isSubmitting} // Pass the loading state for submission
      apiError={apiError} // Pass the API error state
      defaultValues={productData} // Pass the fetched product data as default values
    />
  ) : (
    <p className="text-center mt-10 text-gray-500">No product data available for editing.</p>
  );
}
