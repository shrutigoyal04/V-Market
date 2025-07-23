// frontend/src/hooks/useProductForm.ts
'use client';

import { useState, useCallback, useEffect } from 'react';

// Define the shape of product form data
interface ProductFormData {
  name: string;
  price: string; // Keep as string for input value, convert to number later
  description: string;
  quantity: string; // Keep as string for input value, convert to number later
  imageUrl: string;
}

interface UseProductFormProps {
  initialData?: ProductFormData; // Optional initial data for edit forms
  onSubmit: (data: ProductFormData) => Promise<void>; // Async function for create/update API call
  redirectPath?: string; // Optional path to redirect after successful submission
}

interface UseProductFormResult {
  formData: ProductFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>; // Expose setFormData for initial loading
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Expose setLoading for initial loading
  setError: React.Dispatch<React.SetStateAction<string | null>>; // Expose setError for initial loading
}

export const useProductForm = ({ initialData, onSubmit, redirectPath }: UseProductFormProps): UseProductFormResult => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      price: '',
      description: '',
      quantity: '',
      imageUrl: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update formData if initialData changes (e.g., when product data loads for edit form)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(formData);
      if (redirectPath) {
        // You would typically use useRouter from next/navigation here
        // However, hooks should be pure, so useRouter should be used in the component
        // The component using this hook will handle the redirect.
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit, redirectPath]); // redirectPath also as dependency if used internally

  return { formData, handleChange, handleSubmit, loading, error, setFormData, setLoading, setError };
};
