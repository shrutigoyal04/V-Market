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
  transferQuantity: number;
  targetShopkeeperId: string;
  transferError: string | null;
  transferLoading: boolean;
  handleInitiateTransfer: (product: Product) => void;
  handleSendTransferRequest: () => Promise<void>;
  handleCloseTransferModal: () => void;
  setTransferQuantity: (quantity: number) => void;
  setTargetShopkeeperId: (id: string) => void;
}

export const useProductTransfer = (currentShopkeeperId: string | null, onTransferSuccess?: () => void): UseProductTransferResult => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState<Product | null>(null);
  const [otherShopkeepers, setOtherShopkeepers] = useState<ShopkeeperData[]>([]);
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
    setTransferQuantity(1);
    setTargetShopkeeperId('');
    setTransferError(null);
    setShowTransferModal(true);
  }, []);

  const handleCloseTransferModal = useCallback(() => {
    setShowTransferModal(false);
    setSelectedProductForTransfer(null);
  }, []);

  const handleSendTransferRequest = useCallback(async () => {
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

    // console.log('useProductTransfer: Sending request with Initiator ID (from currentShopkeeperId):', currentShopkeeperId); // LOG 10
    const payload: CreateProductRequestPayload = {
      productId: selectedProductForTransfer.id,
      requesterId: targetShopkeeperId,
      quantity: transferQuantity,
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
  }, [selectedProductForTransfer, targetShopkeeperId, transferQuantity, handleCloseTransferModal, onTransferSuccess, currentShopkeeperId]); // Add currentShopkeeperId to deps

  return {
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
  };
};
