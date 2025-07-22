// frontend/src/app/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import productRequestsApi, { ProductRequestData, ProductRequestStatus, UpdateProductRequestPayload } from '@/api/product-requests.api';
import Cookies from 'js-cookie';

export default function ProductRequestsPage() {
  const [requests, setRequests] = useState<ProductRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentShopkeeperId, setCurrentShopkeeperId] = useState<string | null>(null);

  // Function to fetch requests
  const fetchRequests = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const allRequests = await productRequestsApi.getAllRequestsForShopkeeper();
      setRequests(allRequests || []);
      // Assuming you can get currentShopkeeperId from a consistent source (e.g., re-login or store it)
      // For now, let's rely on the first request's initiator/requester if available,
      // or assume the dashboard fetch already set it.
      // A more robust solution might fetch profile or decode token safely on server route.
      if (allRequests.length > 0 && !currentShopkeeperId) {
        // This is a simplified way to get the current shopkeeper ID if it's not already set
        // In a real app, you'd fetch user profile or pass it from dashboard
        const firstRequest = allRequests[0];
        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Basic decode for immediate use (if senior allows this)
        setCurrentShopkeeperId(tokenPayload.sub); // Assuming 'sub' is shopkeeperId
      }

    } catch (err: any) {
      console.error('Failed to fetch product requests:', err);
      setError(err?.response?.data?.message || 'Failed to load product requests. Please ensure you are logged in.');
      if (err.response?.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, [router]); // Re-fetch on route change (e.g., if navigated here)

  const handleUpdateStatus = async (requestId: string, status: ProductRequestStatus) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
      return;
    }
    setLoading(true); // Indicate loading
    try {
      const payload: UpdateProductRequestPayload = { status };
      await productRequestsApi.updateRequestStatus(requestId, payload);
      alert(`Request ${status.toLowerCase()} successfully!`);
      await fetchRequests(); // Re-fetch all requests to update UI
    } catch (err: any) {
      console.error(`Failed to ${status.toLowerCase()} request:`, err);
      setError(err?.response?.data?.message || `Failed to ${status.toLowerCase()} request.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }
    setLoading(true);
    try {
      await productRequestsApi.deleteRequest(requestId);
      alert('Request cancelled successfully!');
      await fetchRequests(); // Re-fetch all requests to update UI
    } catch (err: any) {
      console.error('Failed to cancel request:', err);
      setError(err?.response?.data?.message || 'Failed to cancel request.');
    } finally {
      setLoading(false);
    }
  };

  const outgoingRequests = requests.filter(req => req.initiatorId === currentShopkeeperId);
  const incomingRequests = requests.filter(req => req.requesterId === currentShopkeeperId);


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
                <div key={req.id} className="border p-4 rounded-xl shadow-sm bg-white">
                  <p className="font-medium">{req.product.name} (Qty: {req.quantity})</p>
                  <p className="text-sm text-gray-700">To: {req.requester.shopName} ({req.requester.email})</p>
                  <p className={`text-sm font-semibold mt-1 ${
                    req.status === ProductRequestStatus.PENDING ? 'text-yellow-600' :
                    req.status === ProductRequestStatus.ACCEPTED ? 'text-green-600' :
                    'text-red-600'
                  }`}>Status: {req.status}</p>
                  {req.status === ProductRequestStatus.PENDING && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      disabled={loading}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
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
                <div key={req.id} className="border p-4 rounded-xl shadow-sm bg-white">
                  <p className="font-medium">{req.product.name} (Qty: {req.quantity})</p>
                  <p className="text-sm text-gray-700">From: {req.initiator.shopName} ({req.initiator.email})</p>
                  <p className={`text-sm font-semibold mt-1 ${
                    req.status === ProductRequestStatus.PENDING ? 'text-yellow-600' :
                    req.status === ProductRequestStatus.ACCEPTED ? 'text-green-600' :
                    'text-red-600'
                  }`}>Status: {req.status}</p>
                  {req.status === ProductRequestStatus.PENDING && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleUpdateStatus(req.id, ProductRequestStatus.ACCEPTED)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, ProductRequestStatus.REJECTED)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
