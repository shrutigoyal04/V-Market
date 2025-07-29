import axios from '@/lib/axios';
import { ProductTransferHistory } from '@/types/product'; // Assuming ProductTransferHistory is in this file

const transferHistoryApi = {
  
  getAll: async (): Promise<ProductTransferHistory[]> => {
    const response = await axios.get('/product-transfer-history');
    return response.data;
  },

  getById: async (id: string): Promise<ProductTransferHistory> => {
    const response = await axios.get(`/product-transfer-history/${id}`);
    return response.data;
  },
};

export default transferHistoryApi;
