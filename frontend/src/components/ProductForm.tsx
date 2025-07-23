import React from 'react';

interface ProductFormProps {
  formData: {
    name: string;
    price: string;
    description: string;
    quantity: string;
    imageUrl: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  buttonText: string;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  buttonText,
  title,
}) => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Processing...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
