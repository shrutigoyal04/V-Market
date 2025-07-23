// frontend/src/app/requests/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import productRequestsApi, { ProductRequestData, ProductRequestStatus, UpdateProductRequestPayload } from '@/api/product-requests.api';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useFetchData } from '@/hooks/useFetchData';
import ProductRequestCard from '@/components/ProductRequestCard';
import { useCallback } from 'react'; // Import useCallback

export default function ProductRequestsPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useAuthUser();
  const currentShopkeeperId = user?.shopkeeperId || null;

  // Add more aggressive logging
  console.log('Requests Page - useAuthUser loading:', userLoading);
  console.log('Requests Page - useAuthUser error:', userError);
  console.log('Requests Page - Authenticated User object:', user);
  console.log('Requests Page - Derived currentShopkeeperId:', currentShopkeeperId);

  // Memoize the fetch function for requests
  const fetchAllRequests = useCallback(
    () => productRequestsApi.getAllRequestsForShopkeeper(),
    [] // No dependencies needed for this fetch function itself, as currentShopkeeperId is a dependency for useFetchData
  );

  // Use useFetchData for product requests, refetch when currentShopkeeperId changes
  const {
    data: requests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useFetchData(
    fetchAllRequests,
    [currentShopkeeperId] // Refetch when currentShopkeeperId is available/changes
  );

  const loading = userLoading || requestsLoading;
  const error = userError || requestsError;

  const handleUpdateStatus = useCallback(async (requestId: string, status: ProductRequestStatus) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
      return;
    }
    try {
      const payload: UpdateProductRequestPayload = { status };
      await productRequestsApi.updateRequestStatus(requestId, payload);
      alert(`Request ${status.toLowerCase()} successfully!`);
      await refetchRequests();
    } catch (err: any) {
      console.error(`Failed to ${status.toLowerCase()} request:`, err);
      alert(err?.response?.data?.message || `Failed to ${status.toLowerCase()} request.`);
    }
  }, [refetchRequests]); // Dependency on refetchRequests

  const handleCancelRequest = useCallback(async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }
    try {
      await productRequestsApi.deleteRequest(requestId);
      alert('Request cancelled successfully!');
      await refetchRequests();
    } catch (err: any) {
      console.error('Failed to cancel request:', err);
      alert(err?.response?.data?.message || 'Failed to cancel request.');
    }
  }, [refetchRequests]); // Dependency on refetchRequests

  const outgoingRequests = Array.isArray(requests) ? requests.filter(req => req.initiatorId === currentShopkeeperId) : [];
  const incomingRequests = Array.isArray(requests) ? requests.filter(req => req.requesterId === currentShopkeeperId) : [];


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Transfer Requests</h1>

      {loading ? (
        <p className="text-gray-600">Loading requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Outgoing Requests Section */}
          <h2 className="text-2xl font-semibold mb-4 mt-8">My Outgoing Requests (initiated by me)</h2>
          {outgoingRequests.length === 0 ? (
            <p className="text-gray-500 mb-6">You have not initiated any product transfer requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {outgoingRequests.map(req => (
                <ProductRequestCard
                  key={req.id}
                  request={req}
                  type="outgoing"
                  onCancelRequest={handleCancelRequest}
                  loading={requestsLoading}
                />
              ))}
            </div>
          )}

          {/* Incoming Requests Section */}
          <h2 className="text-2xl font-semibold mb-4">Incoming Requests (I am the requester)</h2>
          {incomingRequests.length === 0 ? (
            <p className="text-gray-500">No incoming product transfer requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map(req => (
                <ProductRequestCard
                  key={req.id}
                  request={req}
                  type="incoming"
                  onUpdateStatus={handleUpdateStatus}
                  loading={requestsLoading}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
