'use client';

import React from 'react';
import transferHistoryApi from '@/api/transfer-history.api';
import { useFetchData } from '@/hooks/useFetchData'; // Assuming this hook exists from previous steps
import { ProductTransferHistory } from '@/types/product';
import TransferHistoryCard from '@/components/TransferHistoryCard'; // We'll create this next

export default function TransferHistoryPage() {
  const { data: historyRecords, loading, error } = useFetchData<ProductTransferHistory[]>(transferHistoryApi.getAll);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading transfer history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        <p>Error loading transfer history:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Transfer History</h1>
      {historyRecords && historyRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyRecords.map((record) => (
            <TransferHistoryCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No product transfer history found.</p>
      )}
    </div>
  );
}
