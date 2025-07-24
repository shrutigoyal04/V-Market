'use client';

import React from 'react';
import { ProductTransferHistory } from '@/types/product';
import Link from 'next/link';

interface TransferHistoryCardProps {
  record: ProductTransferHistory;
}

const TransferHistoryCard: React.FC<TransferHistoryCardProps> = ({ record }) => {
  const formattedDate = new Date(record.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">{record.product.name}</h3>
      <p className="text-sm text-gray-700 mb-1">
        <span className="font-medium">Quantity:</span> {record.quantityTransferred}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <span className="font-medium">From:</span> {record.initiatorShopkeeper.shopName}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <span className="font-medium">To:</span> {record.receiverShopkeeper.shopName}
      </p>
      {record.notes && (
        <p className="text-sm text-gray-500 italic mt-2">"{record.notes}"</p>
      )}
      <p className="text-xs text-gray-400 mt-2">Transferred on: {formattedDate}</p>

      {record.request && (
        <div className="mt-3">
          <Link href={`/requests?requestId=${record.request.id}`} className="text-indigo-600 hover:underline text-sm">
            View Original Request
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransferHistoryCard;

