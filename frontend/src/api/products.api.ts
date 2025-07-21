import axios from '../lib/axios'; // this uses your configured axiosInstance

interface ProductData {
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
}

const productsApi = {
  // Create a new product
  create: async (data: ProductData) => {
    const response = await axios.post('/products', data);
    return response.data;
  },

  // Get all products (keep this for now, but dashboard will use specific one)
  getAll: async () => {
    const response = await axios.get('/products');
    return response.data;
  },

  // New: Get products for the logged-in shopkeeper
  getShopkeeperProducts: async () => {
    const response = await axios.get('/products/my-products');
    return response.data;
  },

  // Get product by ID
  getById: async (productId: string) => {
    const response = await axios.get(`/products/${productId}`);
    return response.data;
  },

  // Update product
  update: async (productId: string, data: Partial<ProductData>) => {
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
