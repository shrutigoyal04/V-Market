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
    <div
      key={record.id}
      // Enhanced card styling: consistent with other product/shop cards
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full"
    >
      <div className="flex-grow"> {/* Flex-grow to push the link to the bottom */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
          {record.product.name}
        </h3> {/* Larger, bolder title */}
        <p className="text-lg text-gray-700 mb-2">
          Quantity Transferred: <span className="font-semibold">{record.quantityTransferred}</span>
        </p>
        <p className="text-base text-gray-600 mb-1">
          <span className="font-medium">From:</span> {record.initiatorShopkeeper.shopName} ({record.initiatorShopkeeper.email})
        </p>
        <p className="text-base text-gray-600 mb-1">
          <span className="font-medium">To:</span> {record.receiverShopkeeper.shopName} ({record.receiverShopkeeper.email})
        </p>
        {record.notes && (
          <p className="text-sm text-gray-500 italic mt-2 line-clamp-2">{`"${record.notes}"`}</p> // Added line-clamp
        )}
        <p className="text-xs text-gray-400 mt-2">Transferred on: {formattedDate}</p>
      </div>

      {record.request && (
        <div className="mt-4 pt-4 border-t border-gray-100"> {/* Separator for the link */}
          <Link href={`/requests?requestId=${record.request.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 text-sm">
            View Original Request
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransferHistoryCard;

