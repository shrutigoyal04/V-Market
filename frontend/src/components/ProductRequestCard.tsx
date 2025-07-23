// frontend/src/components/ProductRequestCard.tsx
import React from 'react';
import { ProductRequestStatus } from '@/api/product-requests.api';
import { ProductRequest } from '@/types/product';

interface ProductRequestCardProps {
  request: ProductRequest;
  type: 'outgoing' | 'incoming';
  currentShopkeeperId: string | null;
  onUpdateStatus?: (id: string, status: ProductRequestStatus) => Promise<void>;
  onCancelRequest?: (id: string) => Promise<void>;
}

const ProductRequestCard: React.FC<ProductRequestCardProps> = ({
  request,
  type,
  currentShopkeeperId,
  onUpdateStatus,
  onCancelRequest,
}) => {
  const statusColorClass = {
    [ProductRequestStatus.PENDING]: 'text-yellow-600',
    [ProductRequestStatus.ACCEPTED]: 'text-green-600',
    [ProductRequestStatus.REJECTED]: 'text-red-600',
    [ProductRequestStatus.COMPLETED]: 'text-blue-600',
  };

  // Determine if the current user is the initiator or requester
  const isCurrentUserInitiator = currentShopkeeperId === request.initiatorId;
  const isCurrentUserRequester = currentShopkeeperId === request.requesterId;

  return (
    <div key={request.id} className="border p-4 rounded-xl shadow-sm bg-white">
      <p className="font-medium">
        {request.product.name} (Qty: {request.quantity})
      </p>
      {type === 'outgoing' ? (
        <p className="text-sm text-gray-700">
          To: {request.requester.shopName} ({request.requester.email})
        </p>
      ) : (
        <p className="text-sm text-gray-700">
          From: {request.initiator.shopName} ({request.initiator.email})
        </p>
      )}
      <p className={`text-sm font-semibold mt-1 ${statusColorClass[request.status]}`}>Status: {request.status}</p>

      {/* Outgoing Requests: Only initiator can cancel pending requests */}
      {type === 'outgoing' && request.status === ProductRequestStatus.PENDING && onCancelRequest && isCurrentUserInitiator && (
        <button
          onClick={() => onCancelRequest(request.id)}
          disabled={!isCurrentUserInitiator || request.status !== ProductRequestStatus.PENDING}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Cancel Request
        </button>
      )}

      {/* Incoming Requests: Only requester can accept/reject pending requests */}
      {type === 'incoming' && request.status === ProductRequestStatus.PENDING && onUpdateStatus && isCurrentUserRequester && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onUpdateStatus(request.id, ProductRequestStatus.ACCEPTED)}
            disabled={!isCurrentUserRequester || request.status !== ProductRequestStatus.PENDING}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Accept
          </button>
          <button
            onClick={() => onUpdateStatus(request.id, ProductRequestStatus.REJECTED)}
            disabled={!isCurrentUserRequester || request.status !== ProductRequestStatus.PENDING}
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