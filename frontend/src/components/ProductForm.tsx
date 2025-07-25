import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateProductDto, UpdateProductDto, Product } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import z from zod

interface ProductFormProps {
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  loading: boolean;
  apiError: string | null;
  buttonText: string;
  title: string;
  defaultValues?: Partial<Product>;
}

// Define the Zod schema for product form validation
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').min(1, 'Product name is required'),
  price: z.preprocess(
    (val) => Number(val), // Preprocess to convert to number
    z.number().min(0.01, 'Price must be greater than 0').refine((val) => !isNaN(val), 'Price must be a number')
  ),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
  quantity: z.preprocess(
    (val) => Number(val), // Preprocess to convert to number
    z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1').refine((val) => !isNaN(val), 'Quantity must be a number')
  ),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')), // Optional URL, allows empty string
});

// Infer the type for the form inputs
type ProductFormInputs = z.infer<typeof productSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  loading,
  apiError,
  buttonText,
  title,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormInputs>({ // Use ProductFormInputs type
    resolver: zodResolver(productSchema), // Integrate Zod resolver
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      price: defaultValues?.price || 0,
      quantity: defaultValues?.quantity || 0,
      imageUrl: defaultValues?.imageUrl || '',
    },
  });

  const handleFormSubmit = async (data: ProductFormInputs) => { // Data is now already parsed by Zod
    // Zod's preprocess and refine handle type conversion and validation,
    // so explicit parsing with parseFloat and parseInt is no longer needed here.
    await onSubmit(data as CreateProductDto | UpdateProductDto);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
          <input
            id="name"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('price')}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (optional):</label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
          <input
            id="quantity"
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL (optional):</label>
          <input
            id="imageUrl"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('imageUrl')}
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
