import axios from '../lib/axios';

// Assuming your backend has a DTO or interface for Shopkeeper data
export interface ShopkeeperData {
  id: string;
  email: string;
  shopName: string;
  address: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  // Add any other properties returned by your backend for a shopkeeper
}

const shopkeepersApi = {
  // Get all shopkeepers
  getAll: async (): Promise<ShopkeeperData[]> => {
    const response = await axios.get('/shopkeeper'); // Assuming backend endpoint is /shopkeeper
    return response.data;
  },

  // Get a single shopkeeper by ID
  getById: async (shopkeeperId: string): Promise<ShopkeeperData> => {
    const response = await axios.get(`/shopkeeper/${shopkeeperId}`);
    return response.data;
  },
};

export default shopkeepersApi;
