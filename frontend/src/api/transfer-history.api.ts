import axios from '@/lib/axios';
import { ProductTransferHistory } from '@/types/product'; // Assuming ProductTransferHistory is in this file

const transferHistoryApi = {
  /**
   * Fetches all product transfer history records for the authenticated shopkeeper.
   */
  getAll: async (): Promise<ProductTransferHistory[]> => {
    const response = await axios.get('/product-transfer-history');
    return response.data;
  },

  /**
   * Fetches a single product transfer history record by its ID.
   * @param id The ID of the transfer history record.
   */
  getById: async (id: string): Promise<ProductTransferHistory> => {
    const response = await axios.get(`/product-transfer-history/${id}`);
    return response.data;
  },
};

export default transferHistoryApi;
