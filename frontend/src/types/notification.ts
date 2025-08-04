import { ShopkeeperData } from '@/api/shopkeepers.api'; // Assuming this path is correct for ShopkeeperData

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  PRODUCT_REQUEST_SENT = 'PRODUCT_REQUEST_SENT',
  PRODUCT_REQUEST_ACCEPTED = 'PRODUCT_REQUEST_ACCEPTED',
  PRODUCT_REQUEST_REJECTED = 'PRODUCT_REQUEST_REJECTED',
  PRODUCT_REQUEST_CANCELLED = 'PRODUCT_REQUEST_CANCELLED',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  link?: string;
  isRead: boolean;
  relatedEntityId?: string;
  expiresAt?: string; // Date string from backend
  createdAt: string; // Date string from backend
  updatedAt: string; // Date string from backend

  // Relationships (these will be hydrated by backend if eager loaded)
  sender?: ShopkeeperData;
  senderId?: string;
  receiver: ShopkeeperData;
  receiverId: string;
}