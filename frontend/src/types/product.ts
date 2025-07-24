import { ShopkeeperData as Shopkeeper } from '@/api/shopkeepers.api'; // Import Shopkeeper from its definition file

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
    id: string; // Add id to shopkeeper interface for consistency
    email: string;
    shopName: string;
    address: string;
    phone?: string;
  };
}

export interface ProductRequest {
  id: string;
  product: Product;
  productId: string;
  requester: Shopkeeper; // The shopkeeper receiving the product
  requesterId: string;
  initiator: Shopkeeper; // The shopkeeper sending the product (owner)
  initiatorId: string;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'; // 'COMPLETED' is added when transferred to history
  createdAt: string;
  updatedAt: string;
}

export interface ProductTransferHistory {
  id: string;
  product: Product;
  productId: string;
  initiatorShopkeeper: Shopkeeper;
  initiatorShopkeeperId: string;
  receiverShopkeeper: Shopkeeper;
  receiverShopkeeperId: string;
  quantityTransferred: number;
  request?: ProductRequest; // Optional link to the original request
  requestId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// NEW INTERFACES: DTOs for Product Creation and Update
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
}
