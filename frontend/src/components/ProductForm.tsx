import React from 'react';
import { useForm } from 'react-hook-form'; // Import useForm
import { CreateProductDto, UpdateProductDto, Product } from '@/types/product'; // Import DTOs and Product interface

interface ProductFormProps {
  // `onSubmit` will now receive data validated by react-hook-form
  // It can be for creation (CreateProductDto) or update (UpdateProductDto)
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  loading: boolean;
  apiError: string | null; // Renamed from 'error' to 'apiError' for clarity
  buttonText: string;
  title: string;
  defaultValues?: Partial<Product>; // Optional default values for editing
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  loading,
  apiError,
  buttonText,
  title,
  defaultValues, // Destructure defaultValues
}) => {
  // Initialize useForm with default values for editing
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset // To reset form or set new default values
  } = useForm<CreateProductDto | UpdateProductDto>({
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      price: defaultValues?.price || 0,
      quantity: defaultValues?.quantity || 0,
      imageUrl: defaultValues?.imageUrl || '',
    },
  });

  // Ensure price and quantity are numbers before passing to onSubmit
  const handleFormSubmit = async (data: any) => {
    const parsedData: CreateProductDto | UpdateProductDto = {
      ...data,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity, 10),
    };
    await onSubmit(parsedData);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {apiError && <p className="text-red-500 mb-2">{apiError}</p>}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate> {/* Added noValidate */}
        <div>
          <input
            id="name"
            type="text"
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded"
            {...register('name', {
              required: 'Product name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters',
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            id="price"
            type="number"
            step="0.01" // Allow decimal prices
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
            {...register('price', {
              required: 'Price is required',
              min: {
                value: 0.01,
                message: 'Price must be greater than 0',
              },
              valueAsNumber: true, // Convert to number on submission
            })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <textarea
            id="description"
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            rows={4} // Added rows for better textarea display
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description cannot exceed 500 characters',
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <input
            id="quantity"
            type="number"
            placeholder="Quantity"
            className="w-full border px-3 py-2 rounded"
            {...register('quantity', {
              required: 'Quantity is required',
              min: {
                value: 1,
                message: 'Quantity must be at least 1',
              },
              valueAsNumber: true, // Convert to number on submission
            })}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <input
            id="imageUrl"
            type="text"
            placeholder="Image URL (optional)"
            className="w-full border px-3 py-2 rounded"
            {...register('imageUrl', {
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/, // Basic URL pattern
                message: 'Invalid URL format',
              },
            })}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
