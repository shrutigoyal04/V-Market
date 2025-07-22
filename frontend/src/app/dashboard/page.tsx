// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import productsApi from '@/api/products.api';
import productRequestsApi, { CreateProductRequestPayload, ProductRequestStatus } from '@/api/product-requests.api'; // Import new API
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api'; // Import shopkeepersApi
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ShopkeeperDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShopkeeperId, setCurrentShopkeeperId] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState<Product | null>(null);
  const [otherShopkeepers, setOtherShopkeepers] = useState<ShopkeeperData[]>([]);
  const [transferQuantity, setTransferQuantity] = useState<number>(1);
  const [targetShopkeeperId, setTargetShopkeeperId] = useState<string>('');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        // Fetch current shopkeeper's products
        const productsResponse = await productsApi.getShopkeeperProducts();
        setProducts(productsResponse.products || []);
        setCurrentShopkeeperId(productsResponse.shopkeeperId || null);

        // Fetch all shopkeepers for transfer dropdown, excluding current shopkeeper
        const allShops = await shopkeepersApi.getAll();
        const filteredShops = allShops.filter(shop => shop.id !== productsResponse.shopkeeperId);
        setOtherShopkeepers(filteredShops);

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard. Please ensure you are logged in.');
        if (err.response?.status === 401) {
          Cookies.remove('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [router]);

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await productsApi.delete(id);
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        setError(err?.response?.data?.message || 'Failed to delete product.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInitiateTransfer = (product: Product) => {
    setSelectedProductForTransfer(product);
    setTransferQuantity(1); // Default to 1
    setTargetShopkeeperId(''); // Clear previous selection
    setTransferError(null);
    setShowTransferModal(true);
  };

  const handleSendTransferRequest = async () => {
    if (!selectedProductForTransfer || !targetShopkeeperId || transferQuantity <= 0) {
      setTransferError('Please select a product, target shopkeeper, and valid quantity.');
      return;
    }
    if (transferQuantity > selectedProductForTransfer.quantity) {
      setTransferError('Quantity requested exceeds available stock.');
      return;
    }

    setTransferLoading(true);
    setTransferError(null);

    const payload: CreateProductRequestPayload = {
      productId: selectedProductForTransfer.id,
      requesterId: targetShopkeeperId,
      quantity: transferQuantity,
    };

    try {
      await productRequestsApi.createExportRequest(payload);
      alert('Product transfer request sent successfully!');
      setShowTransferModal(false);
      // Optionally, re-fetch products to update current stock
      const productsResponse = await productsApi.getShopkeeperProducts();
      setProducts(productsResponse.products || []);
    } catch (err: any) {
      console.error('Failed to send transfer request:', err);
      setTransferError(err?.response?.data?.message || 'Failed to send transfer request.');
    } finally {
      setTransferLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Shopkeeper Dashboard</h1>

      <button
        onClick={handleAddNewProduct}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Add New Product
      </button>

      {loading ? (
        <p className="text-gray-600">Loading your products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {Array.isArray(products) && products.length === 0 ? (
            <p className="text-gray-500">You have no products listed. Click "Add New Product" to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(products) && products.map((product) => (
                <div
                  key={product.id}
                  className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                >
                  <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                  <p className="text-green-700 font-medium">₹{product.price}</p>
                  <p className="text-sm">Quantity: {product.quantity}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  )}
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
                  )}
                  <div className="flex space-x-2 mt-4">
                    {currentShopkeeperId && product.shopkeeper && currentShopkeeperId === product.shopkeeper.id && (
                      <>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleInitiateTransfer(product)} // New Transfer button
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        >
                          Transfer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Transfer Product Modal */}
      {showTransferModal && selectedProductForTransfer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Transfer Product: {selectedProductForTransfer.name}</h2>
            {transferError && <p className="text-red-500 mb-4">{transferError}</p>}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity (Available: {selectedProductForTransfer.quantity}):</label>
              <input
                type="number"
                id="quantity"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Min quantity 1
                min="1"
                max={selectedProductForTransfer.quantity}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="targetShopkeeper" className="block text-gray-700 text-sm font-bold mb-2">Transfer to Shop:</label>
              <select
                id="targetShopkeeper"
                value={targetShopkeeperId}
                onChange={(e) => setTargetShopkeeperId(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select a shop</option>
                {otherShopkeepers.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.shopName} ({shop.email})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowTransferModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTransferRequest}
                disabled={transferLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                {transferLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
