// frontend/src/app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useProductManagement } from '@/hooks/useProductManagement'; // Import custom hook
import { useProductTransfer } from '@/hooks/useProductTransfer'; // Import custom hook
import ProductCard from '@/components/ProductCard'; // Import ProductCard component
import ProductTransferModal from '@/components/ProductTransferModal'; // Import ProductTransferModal component

export default function ShopkeeperDashboardPage() {
  const router = useRouter();

  // Use product management hook
  const { products, loading, error, currentShopkeeperId, fetchProducts, handleDeleteProduct } = useProductManagement();

  // Use product transfer hook
  const {
    showTransferModal,
    selectedProductForTransfer,
    otherShopkeepers,
    transferQuantity,
    targetShopkeeperId,
    transferError,
    transferLoading,
    handleInitiateTransfer,
    handleSendTransferRequest,
    handleCloseTransferModal,
    setTransferQuantity,
    setTargetShopkeeperId,
  } = useProductTransfer(currentShopkeeperId, fetchProducts); // Pass fetchProducts as success callback

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
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

      <ProductTransferModal
        show={showTransferModal}
        product={selectedProductForTransfer}
        otherShopkeepers={otherShopkeepers}
        quantity={transferQuantity}
        targetShopkeeperId={targetShopkeeperId}
        error={transferError}
        loading={transferLoading}
        onQuantityChange={setTransferQuantity}
        onTargetShopkeeperChange={setTargetShopkeeperId}
        onSendRequest={handleSendTransferRequest}
        onClose={handleCloseTransferModal}
      />
    </div>
  );
}
