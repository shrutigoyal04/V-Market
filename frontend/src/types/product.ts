export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  shopkeeper: { // Ensure this matches backend's eager loading
    id: string;
    email: string;
    shopName: string;
    address: string;
    phone?: string;
  };
}
