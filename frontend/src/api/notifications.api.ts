// frontend/src/api/notifications.api.ts
import axios from '@/lib/axios'; // Your configured axios instance
import { Notification } from '@/types/notification'; // Import the Notification interface

const notificationsApi = {
  /**
   * Fetches all notifications for the authenticated user.
   */
  getAllNotifications: async (): Promise<Notification[]> => {
    const response = await axios.get('/notifications');
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await axios.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await axios.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Marks all notifications for the authenticated user as read.
   */
  markAllAsRead: async (): Promise<void> => {
    await axios.patch('/notifications/mark-all-read');
  },
};

export default notificationsApi;