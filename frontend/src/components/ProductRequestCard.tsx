// frontend/src/components/ProductRequestCard.tsx
import React from 'react';
import { ProductRequestData, ProductRequestStatus } from '@/api/product-requests.api'; // Import types

interface ProductRequestCardProps {
  request: ProductRequestData;
  type: 'outgoing' | 'incoming'; // Distinguish card type
  onUpdateStatus?: (id: string, status: ProductRequestStatus) => void;
  onCancelRequest?: (id: string) => void;
  loading?: boolean; // Optional loading prop to disable buttons
}

const ProductRequestCard: React.FC<ProductRequestCardProps> = ({
  request,
  type,
  onUpdateStatus,
  onCancelRequest,
  loading = false,
}) => {
  const statusColorClass = {
    [ProductRequestStatus.PENDING]: 'text-yellow-600',
    [ProductRequestStatus.ACCEPTED]: 'text-green-600',
    [ProductRequestStatus.REJECTED]: 'text-red-600',
    [ProductRequestStatus.COMPLETED]: 'text-blue-600',
  };

  return (
    <div key={request.id} className="border p-4 rounded-xl shadow-sm bg-white">
      <p className="font-medium">{request.product.name} (Qty: {request.quantity})</p>
      {type === 'outgoing' ? (
        <p className="text-sm text-gray-700">To: {request.requester.shopName} ({request.requester.email})</p>
      ) : (
        <p className="text-sm text-gray-700">From: {request.initiator.shopName} ({request.initiator.email})</p>
      )}
      <p className={`text-sm font-semibold mt-1 ${statusColorClass[request.status]}`}>Status: {request.status}</p>

      {type === 'outgoing' && request.status === ProductRequestStatus.PENDING && onCancelRequest && (
        <button
          onClick={() => onCancelRequest(request.id)}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Cancel Request
        </button>
      )}

      {type === 'incoming' && request.status === ProductRequestStatus.PENDING && onUpdateStatus && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onUpdateStatus(request.id, ProductRequestStatus.ACCEPTED)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Accept
          </button>
          <button
            onClick={() => onUpdateStatus(request.id, ProductRequestStatus.REJECTED)}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductRequestCard;