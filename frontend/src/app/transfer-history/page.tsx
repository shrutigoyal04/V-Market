// frontend/src/app/transfer-history/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Import useState, useEffect, useCallback
import transferHistoryApi from '@/api/transfer-history.api';
// REMOVED: import { useFetchData } from '@/hooks/useFetchData'; // Not suitable for non-paginated data
import { ProductTransferHistory } from '@/types/product';
import TransferHistoryCard from '@/components/TransferHistoryCard';
import { useAuthUser } from '@/hooks/useAuthUser'; // Import useAuthUser

export default function TransferHistoryPage() {
  const { user, loading: userLoading, error: userError } = useAuthUser();
  const currentShopkeeperId = user?.shopkeeperId || null;

  const [historyRecords, setHistoryRecords] = useState<ProductTransferHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!currentShopkeeperId) {
      setHistoryRecords([]);
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const records = await transferHistoryApi.getAll();
      setHistoryRecords(records);
    } catch (err: any) {
      console.error('Failed to fetch transfer history:', err);
      setHistoryError(err?.response?.data?.message || 'Failed to load transfer history.');
    } finally {
      setLoadingHistory(false);
    }
  }, [currentShopkeeperId]); // Dependency on currentShopkeeperId

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Dependency on fetchHistory

  const loading = userLoading || loadingHistory; // Combine loading states
  const error = userError || historyError; // Combine error states

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner">
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
          <p>{error}</p>
        </div>
      ) : (
        <>
          {historyRecords && historyRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
