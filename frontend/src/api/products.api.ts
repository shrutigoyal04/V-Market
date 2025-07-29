import axios from '../lib/axios'; // this uses your configured axiosInstance
import { Product, CreateProductDto, UpdateProductDto } from '@/types/product'; // Import Product interface and DTOs

// Removed local ProductData interface as we'll use DTOs from types/product.ts

interface ShopkeeperProductsResponse {
  shopkeeperId: string;
  products: Product[];
}

// Define the expected paginated response structure for products
interface PaginatedProductsResponse {
  products: Product[];
  total: number;
}

const productsApi = {
  // Create a new product
  create: async (data: CreateProductDto) => { // Use CreateProductDto
    const response = await axios.post('/products', data);
    return response.data;
  },

  // Re-implementing pagination for getAll
  getAll: async (page: number, limit: number, search: string = ''): Promise<PaginatedProductsResponse> => {
    const response = await axios.get(`/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`); // Encode search term
    return response.data;
  },

  // Get products for the logged-in shopkeeper
  getShopkeeperProducts: async (): Promise<ShopkeeperProductsResponse> => {
    const response = await axios.get('/products/my-products');
    return response.data;
  },

  // NEW: Get products for a specific shopkeeper (public view)
  getProductsByShopId: async (shopkeeperId: string): Promise<Product[]> => {
    const response = await axios.get(`/products/shop/${shopkeeperId}`);
    return response.data;
  },

  // Get product by ID
  getById: async (productId: string) => {
    const response = await axios.get(`/products/${productId}`);
    return response.data;
  },

  // Update product
  update: async (productId: string, data: UpdateProductDto) => { // Use UpdateProductDto
    const response = await axios.patch(`/products/${productId}`, data);
    return response.data;
  },

  // Delete product
  delete: async (productId: string) => {
    const response = await axios.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productsApi;
