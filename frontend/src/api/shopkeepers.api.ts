import axios from '../lib/axios';

export interface ShopkeeperData {
  id: string;
  email: string;
  shopName: string;
  address: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

const shopkeepersApi = {
  // REVERTED: Get all shopkeepers without pagination
  getAll: async (): Promise<ShopkeeperData[]> => {
    const response = await axios.get('/shopkeeper');
    return response.data;
  },

  getById: async (shopkeeperId: string): Promise<ShopkeeperData> => {
    const response = await axios.get(`/shopkeeper/${shopkeeperId}`);
    return response.data;
  },
};

export default shopkeepersApi;
