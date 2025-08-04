// frontend/src/app/requests/page.tsx
'use client';

// CONSOLIDATED IMPORTS:
import productRequestsApi, { ProductRequestStatus, UpdateProductRequestPayload, ProductRequestData } from '@/api/product-requests.api';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';
// REMOVED: import { useFetchData } from '@/hooks/useFetchData'; // This hook is for paginated data
import RequestListSection from '@/components/RequestListSection';
import { useCallback, useEffect, useState } from 'react'; // Import useState and useEffect
import { getSocket } from '@/lib/socket'; // Your socket instance
import type { ProductRequest } from '@/types/product'; // Adjust path as needed

type ProductRequestUpdatePayload = {
  requestId: string;
  status: string;
  updatedRequest: ProductRequest;
};

export default function ProductRequestsPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useAuthUser();
  const currentShopkeeperId = user?.shopkeeperId || null;

  const [requests, setRequests] = useState<ProductRequestData[]>([]); // Use useState for requests
  const [loadingRequests, setLoadingRequests] = useState(true); // Separate loading state for requests
  const [requestsError, setRequestsError] = useState<string | null>(null); // Separate error state for requests

  // Function to fetch product requests
  const fetchRequests = useCallback(async () => {
    if (!currentShopkeeperId) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }
    setLoadingRequests(true);
    setRequestsError(null);
    try {
      const fetchedRequests = await productRequestsApi.getAllRequestsForShopkeeper();
      setRequests(fetchedRequests);
    } catch (err: any) {
      console.error('Failed to fetch product requests:', err);
      setRequestsError(err?.response?.data?.message || 'Failed to load product requests.');
    } finally {
      setLoadingRequests(false);
    }
  }, [currentShopkeeperId]); // Dependency on currentShopkeeperId

  // Fetch requests when component mounts or currentShopkeeperId changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]); // Dependency on fetchRequests (which depends on currentShopkeeperId)

  useEffect(() => {
    const socket = getSocket();

    function handleProductRequestUpdate({ requestId, status, updatedRequest }: ProductRequestUpdatePayload) {
      fetchRequests();
      // Or update local state as needed
    }

    socket.on('productRequest.updated', handleProductRequestUpdate);

    return () => {
      socket.off('productRequest.updated', handleProductRequestUpdate);
    };
  }, [fetchRequests]);

  const loading = userLoading || loadingRequests; // Combine loading states
  const error = userError || requestsError; // Combine error states

  const handleUpdateStatus = useCallback(async (requestId: string, status: ProductRequestStatus) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
      return;
    }
    try {
      const payload: UpdateProductRequestPayload = { status };
      await productRequestsApi.updateRequestStatus(requestId, payload);
      alert(`Request ${status.toLowerCase()} successfully!`);
      await fetchRequests(); // Re-fetch after status update
    } catch (err: any) {
      console.error(`Failed to ${status.toLowerCase()} request:`, err);
      alert(err.message || `Failed to ${status.toLowerCase()} request.`);
    }
  }, [fetchRequests]);

  const handleCancelRequest = useCallback(async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }
    try {
      await productRequestsApi.deleteRequest(requestId);
      alert('Request cancelled successfully!');
      await fetchRequests(); // Re-fetch after cancellation
    } catch (err: any) {
      console.error('Failed to cancel request:', err);
      alert(err.message || 'Failed to cancel request.');
    }
  }, [fetchRequests]);

  // Ensure requests is an array before filtering
  const outgoingRequests = Array.isArray(requests) ? requests.filter(req => req.initiatorId === currentShopkeeperId) : [];
  const incomingRequests = Array.isArray(requests) ? requests.filter(req => req.requesterId === currentShopkeeperId) : [];

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner">
      {/* Page Header Section */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">Product Transfer Requests</h1>
      </div>

      {/* Loading, Error States */}
      {loading ? (
        <p className="text-center text-gray-600 text-xl py-20">Loading requests...</p>
      ) : error ? (
        <div className="text-red-600 text-center py-20">
          <p className="text-xl font-medium mb-2">Error loading requests:</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <RequestListSection
            title="My Outgoing Requests"
            emptyMessage="You have not initiated any product transfer requests."
            requests={outgoingRequests}
            type="outgoing"
            currentShopkeeperId={currentShopkeeperId}
            onCancelRequest={handleCancelRequest}
            loading={loadingRequests} // Pass requestsLoading to sub-section
          />

          <RequestListSection
            title="Incoming Requests"
            emptyMessage="No incoming product transfer requests."
            requests={incomingRequests}
            type="incoming"
            currentShopkeeperId={currentShopkeeperId}
            onUpdateStatus={handleUpdateStatus}
            loading={loadingRequests} // Pass requestsLoading to sub-section
          />
        </>
      )}
    </div>
  );
}
