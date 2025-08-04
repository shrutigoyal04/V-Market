// frontend/src/hooks/useNotifications.ts
'use client';

// Removed 'React' import as this .ts file no longer directly contains JSX
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { Notification as AppNotification } from '@/types/notification'; // Renamed import to avoid conflict
import notificationsApi from '@/api/notifications.api';
import toast from 'react-hot-toast'; // For pop-up notifications
import { useRouter } from 'next/navigation'; // For navigation on click
import Cookies from 'js-cookie'; // Added js-cookie import
import NotificationToast from '@/components/NotificationToast'; // NEW IMPORT for the dedicated component

interface UseNotificationsResult {
  notifications: AppNotification[]; // Use AppNotification
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

export const useNotifications = (shopkeeperId: string | null): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]); // Use AppNotification
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef(getSocket()); // Get the socket instance

  const router = useRouter(); // For navigating on notification click

  const fetchNotifications = useCallback(async () => {
    if (!shopkeeperId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await notificationsApi.getAllNotifications();
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err?.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [shopkeeperId]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const updatedNotification = await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? updatedNotification : n));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
      toast.dismiss(id); // Dismiss the toast if it's still showing
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      setError(err?.response?.data?.message || 'Failed to mark notification as read.');
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.dismiss(); // Dismiss all toasts
    } catch (err: any) {
      console.error('Failed to mark all notifications as read:', err);
      setError(err?.response?.data?.message || 'Failed to mark all notifications as read.');
    }
  }, []);

  useEffect(() => {
    // Only connect WebSocket if shopkeeperId is present (user is authenticated)
    if (!shopkeeperId) {
      socketRef.current.disconnect(); // Ensure disconnected if no user
      return;
    }

    const socket = socketRef.current;
    if (!socket.connected) {
      // Re-authenticate if token might have changed (e.g., after login/refresh)
      const token = Cookies.get('token');
      socket.auth = { token };
      socket.connect();
    }

    // Listener for new notifications
    const handleNewNotification = (notification: AppNotification) => { // Use AppNotification
      console.log('New notification received via WebSocket:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast notification using the new component
      const notificationToastId = notification.id; // Use notification ID for unique toast
      toast.custom((t) => (
        <NotificationToast
          notification={notification}
          onDismiss={() => toast.dismiss(t.id)}
          onClick={() => {
            markNotificationAsRead(notification.id);
            if (notification.link) {
              router.push(notification.link);
            }
          }}
          toastId={t.id} // Pass the toast's internal ID for dismissal
        />
      ), { id: notificationToastId, duration: Infinity }); // Set duration to Infinity to keep it until dismissed
    };

    // Listener for notification updates (e.g., marked as read by another device)
    const handleNotificationUpdate = (updatedNotification: AppNotification) => { // Use AppNotification
      setNotifications(prev => prev.map(n => n.id === updatedNotification.id ? updatedNotification : n));
      setUnreadCount(prev => updatedNotification.isRead ? (prev > 0 ? prev - 1 : 0) : prev);
    };

    // Listener for notification deletions
    const handleNotificationDeletion = (data: { id: string }) => {
      setNotifications(prev => prev.filter(n => n.id !== data.id));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0); // Decrement if the deleted one was unread (optimistic)
      toast.dismiss(data.id); // Dismiss any toast for this deleted notification
    };

    // Listener for bulk updates (e.g., mark all read)
    const handleBulkNotificationUpdate = (data: { message: string }) => {
        console.log('Bulk notification update:', data.message);
        // Re-fetch to ensure consistency after bulk update from server
        fetchNotifications();
        toast.dismiss(); // Dismiss all toasts as they are all affected
    };

    socket.on('notification.new', handleNewNotification);
    socket.on('notification.updated', handleNotificationUpdate);
    socket.on('notification.deleted', handleNotificationDeletion);
    socket.on('notification.all-read', handleBulkNotificationUpdate); // Listen for 'all-read' event

    // Cleanup on unmount or shopkeeperId change
    return () => {
      socket.off('notification.new', handleNewNotification);
      socket.off('notification.updated', handleNotificationUpdate);
      socket.off('notification.deleted', handleNotificationDeletion);
      socket.off('notification.all-read', handleBulkNotificationUpdate);
      // socket.disconnect(); // Only disconnect if no other components are using it or on full logout
    };
  }, [shopkeeperId, fetchNotifications, markNotificationAsRead, router]); // Dependencies

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};

