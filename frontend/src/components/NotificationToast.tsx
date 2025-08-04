// frontend/src/components/NotificationToast.tsx
import React from 'react';
import { Notification as AppNotification } from '@/types/notification'; // Use AppNotification alias
import { Toaster, toast } from 'react-hot-toast'; // Import toast for dismiss function

interface NotificationToastProps {
  notification: AppNotification;
  onDismiss: () => void; // Function to dismiss the specific toast
  onClick: () => void; // Function to handle click on the toast (e.g., mark read and navigate)
  toastId: string; // The ID of the toast provided by react-hot-toast
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss, onClick, toastId }) => {
  return (
    <div
      className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      onClick={onClick}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {/* You can use different icons based on notification.type */}
            {notification.type === 'ERROR' && <span role="img" aria-label="error" className="text-xl">🚨</span>}
            {notification.type === 'WARNING' && <span role="img" aria-label="warning" className="text-xl">⚠️</span>}
            {notification.type === 'INFO' && <span role="img" aria-label="info" className="text-xl">ℹ️</span>}
            {notification.type.startsWith('PRODUCT_REQUEST') && <span role="img" aria-label="request" className="text-xl">🔔</span>}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              New Notification
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            {notification.link && (
                <p className="mt-1 text-xs text-indigo-500 hover:underline cursor-pointer">
                    Click to view
                </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent onClick from firing on the parent div
            onDismiss();
            toast.dismiss(toastId); // Dismiss the toast via its ID
          }}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;

