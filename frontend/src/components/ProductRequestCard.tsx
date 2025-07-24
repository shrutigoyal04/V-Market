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

  const isCurrentUserInitiator = currentShopkeeperId === request.initiatorId;
  const isCurrentUserRequester = currentShopkeeperId === request.requesterId;

  const formattedDate = new Date(request.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      key={request.id}
      // Enhanced card styling: consistent with ProductCard and ShopkeeperCard
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full"
    >
      <div className="flex-grow"> {/* Flex-grow to push action buttons to bottom */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
          {request.product.name}
        </h3>
        <p className="text-lg text-gray-700 mb-2">
          Quantity: <span className="font-semibold">{request.quantity}</span>
        </p>

        {type === 'outgoing' ? (
          <p className="text-base text-gray-600 mb-1">
            <span className="font-medium">To:</span> {request.requester.shopName} ({request.requester.email})
          </p>
        ) : (
          <p className="text-base text-gray-600 mb-1">
            <span className="font-medium">From:</span> {request.initiator.shopName} ({request.initiator.email})
          </p>
        )}
        <p className={`text-base font-semibold mt-2 ${statusColorClass[request.status]}`}>
          Status: {request.status}
        </p>
        <p className="text-xs text-gray-400 mt-2">Requested on: {formattedDate}</p>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
        {/* Outgoing Requests: Only initiator can cancel pending requests */}
        {type === 'outgoing' && request.status === ProductRequestStatus.PENDING && onCancelRequest && isCurrentUserInitiator && (
          <button
            onClick={() => onCancelRequest(request.id)}
            disabled={!isCurrentUserInitiator || request.status !== ProductRequestStatus.PENDING}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium shadow-sm flex-1"
          >
            Cancel Request
          </button>
        )}

        {/* Incoming Requests: Only requester can accept/reject pending requests */}
        {type === 'incoming' && request.status === ProductRequestStatus.PENDING && onUpdateStatus && isCurrentUserRequester && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, ProductRequestStatus.ACCEPTED)}
              disabled={!isCurrentUserRequester || request.status !== ProductRequestStatus.PENDING}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium shadow-sm flex-1"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, ProductRequestStatus.REJECTED)}
              disabled={!isCurrentUserRequester || request.status !== ProductRequestStatus.PENDING}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium shadow-sm flex-1"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductRequestCard;