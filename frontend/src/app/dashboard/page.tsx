// frontend/src/app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useProductManagement } from '@/hooks/useProductManagement';
import { useProductTransfer } from '@/hooks/useProductTransfer';
import ProductCard from '@/components/ProductCard';
import ProductTransferModal from '@/components/ProductTransferModal';
import { Product } from '@/types/product';
import { useAuthUser } from '@/hooks/useAuthUser'; // Import useAuthUser

export default function ShopkeeperDashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuthUser(); // Get user from useAuthUser
  const currentShopkeeperId = user?.shopkeeperId || null; // Use user.shopkeeperId for currentShopkeeperId

  const { products, loading, error, fetchProducts, handleDeleteProduct } = useProductManagement();

  const {
    showTransferModal,
    selectedProductForTransfer,
    otherShopkeepers,
    transferError,
    transferLoading,
    handleInitiateTransfer,
    handleSendTransferRequest,
    handleCloseTransferModal,
  } = useProductTransfer(currentShopkeeperId, fetchProducts);

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  const handleTransferSubmit = async (data: { quantity: number; targetShopkeeperId: string }): Promise<boolean> => {
    const success = await handleSendTransferRequest(data);
    if (success) {
      router.push('/requests'); // Navigate to requests page on successful transfer
    }
    return success; // Explicitly return the boolean result
  };

  if (userLoading) {
    return <p className="text-center text-gray-600 text-xl py-20">Loading user data...</p>;
  }

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)] rounded-xl shadow-inner">
      {/* Dashboard Header Section */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900">Your Products</h1>
        <button
          onClick={handleAddNewProduct}
          className="px-6 py-3 bg-indigo-700 text-white rounded-lg shadow-md hover:bg-indigo-800 transition duration-200 text-lg font-medium flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Loading, Error, and Empty States */}
      {loading ? (
        <p className="text-center text-gray-600 text-xl py-20">Loading your products...</p>
      ) : error ? (
        <div className="text-red-600 text-center py-20">
          <p className="text-xl font-medium mb-2">Error loading products:</p>
          <p>{error}</p> 
        </div>
      ) : (
        <>
          {Array.isArray(products) && products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xl mb-4">You have no products listed yet.</p>
              <p className="text-gray-600">Click "Add New Product" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(products) && products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentShopkeeperId={currentShopkeeperId}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onTransfer={handleInitiateTransfer}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Product Transfer Modal */}
      <ProductTransferModal
        show={showTransferModal}
        product={selectedProductForTransfer}
        otherShopkeepers={otherShopkeepers}
        error={transferError}
        loading={transferLoading}
        onSubmit={handleTransferSubmit}
        onClose={handleCloseTransferModal}
      />
    </div>
  );
}
