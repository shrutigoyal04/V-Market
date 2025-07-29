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
      // Enhanced card styling: consistent with other product/shop cards, flex-col for internal layout
      className="border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-full"
    >
      {/* Product Image/Placeholder Area (similar to ProductCard) */}
      <div className="mb-4 w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        {record.product.imageUrl ? (
          <img
            src={record.product.imageUrl}
            alt={record.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-6xl">📦</span> // Generic product icon
        )}
      </div>

      {/* Main Content Area - This section will grow to fill space */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
          {record.product.name}
        </h3>
        <p className="text-lg text-gray-700 mb-2">
          Quantity Transferred: <span className="font-semibold">{record.quantityTransferred}</span>
        </p>

        <div className="text-base text-gray-600 mb-2">
          <p><span className="font-medium">From:</span> {record.initiatorShopkeeper.shopName}</p>
          <p className="text-sm text-gray-500">({record.initiatorShopkeeper.email})</p>
        </div>

        <div className="text-base text-gray-600 mb-2">
          <p><span className="font-medium">To:</span> {record.receiverShopkeeper.shopName}</p>
          <p className="text-sm text-gray-500">({record.receiverShopkeeper.email})</p>
        </div>
        
        {/* Removed the entire note section */}
        <p className="text-xs text-gray-400 mt-auto pt-2">Transferred on: {formattedDate}</p>
      </div>

      {/* View Original Request Link */}
      {record.request && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/requests?requestId=${record.request.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 text-sm"
          >
            View Original Request
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransferHistoryCard;

