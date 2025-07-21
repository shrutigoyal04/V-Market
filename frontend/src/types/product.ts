export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Add shopkeeper property here:
  shopkeeper: {
    id: string;
    // Add other shopkeeper properties if needed, e.g., email, shopName
  };
}
