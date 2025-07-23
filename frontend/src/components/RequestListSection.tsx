import React from 'react';
import { ProductRequestStatus, UpdateProductRequestPayload } from '@/api/product-requests.api';
import { ProductRequest } from '@/types/product'; // CORRECTED IMPORT: Import ProductRequest from types
import ProductRequestCard from './ProductRequestCard'; // Adjust path if necessary

interface RequestListSectionProps {
  title: string;
  emptyMessage: string;
  requests: ProductRequest[];
  type: 'incoming' | 'outgoing';
  currentShopkeeperId: string | null;
  onUpdateStatus?: (requestId: string, status: ProductRequestStatus) => Promise<void>;
  onCancelRequest?: (requestId: string) => Promise<void>;
  loading: boolean;
}

const RequestListSection: React.FC<RequestListSectionProps> = ({
  title,
  emptyMessage,
  requests,
  type,
  currentShopkeeperId,
  onUpdateStatus,
  onCancelRequest,
  loading,
}) => {
  if (loading) {
    return <p className="text-gray-600">Loading {title.toLowerCase()}...</p>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 mb-6">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <ProductRequestCard
              key={req.id}
              request={req}
              type={type}
              currentShopkeeperId={currentShopkeeperId}
              onUpdateStatus={onUpdateStatus}
              onCancelRequest={onCancelRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestListSection;
