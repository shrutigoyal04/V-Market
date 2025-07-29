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

// Define the expected paginated response structure for shopkeepers
interface PaginatedShopkeepersResponse {
  shopkeepers: ShopkeeperData[];
  total: number;
}

const shopkeepersApi = {
  // Modified to accept search term
  getAll: async (page: number, limit: number, search: string = ''): Promise<PaginatedShopkeepersResponse> => {
    const response = await axios.get(`/shopkeeper?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`); // Encode search term
    return response.data;
  },

  // This method remains non-paginated and no search for now as per previous discussions for the modal
  getAllNonPaginated: async (): Promise<ShopkeeperData[]> => {
    const response = await axios.get('/shopkeeper');
    return response.data.shopkeepers || response.data;
  },

  getById: async (shopkeeperId: string): Promise<ShopkeeperData> => {
    const response = await axios.get(`/shopkeeper/${shopkeeperId}`);
    return response.data;
  },

  updateShopkeeper: async (shopkeeperId: string, updateData: Partial<ShopkeeperData>): Promise<ShopkeeperData> => {
    const response = await axios.patch(`/shopkeeper/${shopkeeperId}`, updateData);
    return response.data;
  },
};

export default shopkeepersApi;
