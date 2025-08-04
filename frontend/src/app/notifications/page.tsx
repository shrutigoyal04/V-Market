// frontend/src/app/notifications/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { user, loading: userLoading, isAuthenticated } = useAuthUser();
  const router = useRouter();

  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications(user?.shopkeeperId || null);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [userLoading, isAuthenticated, router]);

  const handleNotificationClick = async (notificationId: string, link?: string | null) => {
    await markNotificationAsRead(notificationId);
    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    toast.success('All notifications marked as read!');
  };

  if (userLoading || loading) {
    return <p className="text-center text-gray-600 text-xl py-20">Loading notifications...</p>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-20">
        <p className="text-xl font-medium mb-2">Error loading notifications:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">Your Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-lg font-medium"
          >
            Mark All As Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xl mb-4">You have no notifications yet.</p>
          <p className="text-gray-600">Notifications for product requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-5 border rounded-lg shadow-sm flex items-center justify-between transition-colors duration-200 ${
                notification.isRead ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-200 shadow-md'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">
                  {notification.type === 'ERROR' && '🚨'}
                  {notification.type === 'WARNING' && '⚠️'}
                  {notification.type === 'INFO' && 'ℹ️'}
                  {notification.type.startsWith('PRODUCT_REQUEST') && '🔔'}
                </span>
                <div>
                  <p className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {notification.link && (
                  <button
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 text-sm"
                  >
                    View
                  </button>
                )}
                {!notification.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

