export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  shopkeeper: { 
    email: string;
    shopName: string;
    address: string;
    phone?: string;
  };
}

export interface ProductRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  product: Product; 
  productId: string;
  requester: {
    id: string;
    email: string;
    shopName: string;
    address: string;
    phone?: string;
  };
  requesterId: string;
  initiator: {
    id: string;
    email: string;
    shopName: string;
    address: string;
    phone?: string;
  };
  initiatorId: string;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'; 
}
