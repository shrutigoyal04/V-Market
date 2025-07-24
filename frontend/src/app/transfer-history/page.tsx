'use client';

import React from 'react';
import transferHistoryApi from '@/api/transfer-history.api';
import { useFetchData } from '@/hooks/useFetchData';
import { ProductTransferHistory } from '@/types/product';
import TransferHistoryCard from '@/components/TransferHistoryCard';

export default function TransferHistoryPage() {
  const { data: historyRecords, loading, error } = useFetchData<ProductTransferHistory[]>(transferHistoryApi.getAll);

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner"> {/* Enhanced outer container */}
      {/* Page Header Section */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">Product Transfer History</h1>
      </div>

      {/* Loading, Error, and Empty States */}
      {loading ? (
        <p className="text-center text-gray-600 text-xl py-20">Loading transfer history...</p>
      ) : error ? (
        <div className="text-red-600 text-center py-20">
          <p className="text-xl font-medium mb-2">Error loading transfer history:</p>
          <p>{error}</p> {/* Using error directly as per previous preference */}
        </div>
      ) : (
        <>
          {historyRecords && historyRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Increased gap and added xl column */}
              {historyRecords.map((record) => (
                <TransferHistoryCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xl mb-4">No product transfer history found.</p>
              <p className="text-gray-600">Initiate transfers from your Dashboard to see them here!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
