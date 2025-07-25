// frontend/src/hooks/useProductTransfer.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import productsApi from '@/api/products.api';
import productRequestsApi, { CreateProductRequestPayload } from '@/api/product-requests.api';
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api';
import { Product } from '@/types/product';

interface UseProductTransferResult {
  showTransferModal: boolean;
  selectedProductForTransfer: Product | null;
  otherShopkeepers: ShopkeeperData[];
  transferError: string | null;
  transferLoading: boolean;
  handleInitiateTransfer: (product: Product) => void;
  // Updated signature to accept data directly from the modal's internal form
  handleSendTransferRequest: (data: { quantity: number; targetShopkeeperId: string }) => Promise<void>;
  handleCloseTransferModal: () => void;
  // Removed transferQuantity, targetShopkeeperId, setTransferQuantity, setTargetShopkeeperId
}

export const useProductTransfer = (currentShopkeeperId: string | null, onTransferSuccess?: () => void): UseProductTransferResult => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState<Product | null>(null);
  const [otherShopkeepers, setOtherShopkeepers] = useState<ShopkeeperData[]>([]);
  // These states are now primarily for initial values when opening the modal
  const [transferQuantity, setTransferQuantity] = useState<number>(1);
  const [targetShopkeeperId, setTargetShopkeeperId] = useState<string>('');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);

  // console.log('useProductTransfer: Received currentShopkeeperId:', currentShopkeeperId); // LOG 8

  useEffect(() => {
    const fetchOtherShopkeepers = async () => {
      // console.log('useProductTransfer: Fetching other shopkeepers for ID:', currentShopkeeperId); // LOG 9
      if (!currentShopkeeperId) {
        setOtherShopkeepers([]);
        return;
      }
      try {
        const allShops = await shopkeepersApi.getAll();
        const filteredShops = allShops.filter(shop => shop.id !== currentShopkeeperId);
        setOtherShopkeepers(filteredShops);
      } catch (err: any) {
        // console.error('Failed to fetch other shopkeepers:', err);
        setTransferError('Failed to load other shops for transfer.');
      }
    };

    fetchOtherShopkeepers();
  }, [currentShopkeeperId]);

  const handleInitiateTransfer = useCallback((product: Product) => {
    setSelectedProductForTransfer(product);
    setTransferQuantity(1); // Set initial quantity for modal's default
    setTargetShopkeeperId(''); // Set initial target for modal's default
    setTransferError(null);
    setShowTransferModal(true);
  }, []);

  const handleCloseTransferModal = useCallback(() => {
    setShowTransferModal(false);
    setSelectedProductForTransfer(null);
  }, []);

  // Updated signature to accept quantity and targetShopkeeperId from the modal
  const handleSendTransferRequest = useCallback(async (data: { quantity: number; targetShopkeeperId: string }) => {
    if (!selectedProductForTransfer) {
      setTransferError('No product selected for transfer.');
      return;
    }
    // Zod in the modal now handles quantity and targetShopkeeperId validation,
    // so we don't need redundant checks here.

    setTransferLoading(true);
    setTransferError(null);

    // console.log('useProductTransfer: Sending request with Initiator ID (from currentShopkeeperId):', currentShopkeeperId); // LOG 10
    const payload: CreateProductRequestPayload = {
      productId: selectedProductForTransfer.id,
      requesterId: data.targetShopkeeperId, // Use data from modal
      quantity: data.quantity, // Use data from modal
    };

    try {
      await productRequestsApi.createExportRequest(payload);
      alert('Product transfer request sent successfully!');
      handleCloseTransferModal();
      onTransferSuccess?.(); // Callback to parent to re-fetch products
    } catch (err: any) {
      console.error('Failed to send transfer request:', err);
      setTransferError(err?.response?.data?.message || 'Failed to send transfer request.');
    } finally {
      setTransferLoading(false);
    }
  }, [selectedProductForTransfer, handleCloseTransferModal, onTransferSuccess, currentShopkeeperId]);

  return {
    showTransferModal,
    selectedProductForTransfer,
    otherShopkeepers,
    transferError,
    transferLoading,
    handleInitiateTransfer,
    handleSendTransferRequest,
    handleCloseTransferModal,
    // Removed transferQuantity, targetShopkeeperId, setTransferQuantity, setTargetShopkeeperId from return
  };
};
