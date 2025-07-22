// frontend/src/api/product-requests.api.ts
import axios from '../lib/axios';
import { Product } from '@/types/product'; // Assuming this is defined
import { ShopkeeperData } from './shopkeepers.api'; // Assuming this is defined

// Enums must match backend
export enum ProductRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface CreateProductRequestPayload {
  productId: string;
  requesterId: string; // The shopkeeper who will receive the product
  quantity: number;
}

export interface UpdateProductRequestPayload {
  status: ProductRequestStatus;
}

export interface ProductRequestData {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  requesterId: string;
  initiatorId: string;
  quantity: number;
  status: ProductRequestStatus;
  product: Product; // Full product object eager loaded
  requester: ShopkeeperData; // Full requester shopkeeper object eager loaded
  initiator: ShopkeeperData; // Full initiator shopkeeper object eager loaded
}

const productRequestsApi = {
  // Initiator (owner of product) makes an export request
  createExportRequest: async (data: CreateProductRequestPayload): Promise<ProductRequestData> => {
    const response = await axios.post('/product-requests/export', data);
    return response.data;
  },

  // Get all requests related to the logged-in shopkeeper (as initiator or requester)
  getAllRequestsForShopkeeper: async (): Promise<ProductRequestData[]> => {
    const response = await axios.get('/product-requests');
    return response.data;
  },

  // Get a specific request by ID
  getRequestById: async (requestId: string): Promise<ProductRequestData> => {
    const response = await axios.get(`/product-requests/${requestId}`);
    return response.data;
  },

  // Initiator (product owner) accepts/rejects the request
  updateRequestStatus: async (requestId: string, data: UpdateProductRequestPayload): Promise<ProductRequestData> => {
    const response = await axios.patch(`/product-requests/${requestId}/status`, data);
    return response.data;
  },

  // Initiator can cancel a pending request
  deleteRequest: async (requestId: string): Promise<void> => {
    const response = await axios.delete(`/product-requests/${requestId}`);
    return response.data;
  },
};

export default productRequestsApi;
