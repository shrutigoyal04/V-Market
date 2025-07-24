// frontend/src/app/requests/page.tsx
'use client';

// CONSOLIDATED IMPORTS:
import productRequestsApi, { ProductRequestStatus, UpdateProductRequestPayload } from '@/api/product-requests.api';
import { ProductRequest } from '@/types/product'; // Correct import path for ProductRequest
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useFetchData } from '@/hooks/useFetchData';
import RequestListSection from '@/components/RequestListSection';
import { useCallback } from 'react';

export default function ProductRequestsPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useAuthUser();
  const currentShopkeeperId = user?.shopkeeperId || null;

  // // Logging (keep for now if still debugging)
  // console.log('Requests Page - useAuthUser loading:', userLoading);
  // console.log('Requests Page - useAuthUser error:', userError);
  // console.log('Requests Page - Authenticated User object:', user);
  // console.log('Requests Page - Derived currentShopkeeperId:', currentShopkeeperId);


  // Memoize the fetch function for requests
  const fetchAllRequests = useCallback(
    () => productRequestsApi.getAllRequestsForShopkeeper(),
    []
  );

  // Use useFetchData for product requests, refetch when currentShopkeeperId changes
  const {
    data: requests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useFetchData<ProductRequest[]>( // Correct type argument
    fetchAllRequests,
    [currentShopkeeperId]
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
      alert(err.message || `Failed to ${status.toLowerCase()} request.`);
    }
  }, [refetchRequests]);

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
      alert(err.message || 'Failed to cancel request.');
    }
  }, [refetchRequests]);

  const outgoingRequests = Array.isArray(requests) ? requests.filter(req => req.initiatorId === currentShopkeeperId) : [];
  const incomingRequests = Array.isArray(requests) ? requests.filter(req => req.requesterId === currentShopkeeperId) : [];


  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner"> {/* Enhanced outer container */}
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
          <p>{error}</p> {/* Use error directly as per previous preference */}
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
            loading={requestsLoading} // Pass requestsLoading to sub-section
          />

          <RequestListSection
            title="Incoming Requests"
            emptyMessage="No incoming product transfer requests."
            requests={incomingRequests}
            type="incoming"
            currentShopkeeperId={currentShopkeeperId}
            onUpdateStatus={handleUpdateStatus}
            loading={requestsLoading} // Pass requestsLoading to sub-section
          />
        </>
      )}
    </div>
  );
}
