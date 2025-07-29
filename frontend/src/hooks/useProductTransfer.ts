'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product } from '@/types/product'; // Only import Product from types/product
import productRequestsApi, { CreateProductRequestPayload } from '@/api/product-requests.api'; // Import CreateProductRequestPayload from its correct api file
import shopkeepersApi, { ShopkeeperData } from '@/api/shopkeepers.api';

interface UseProductTransferResult {
  showTransferModal: boolean;
  selectedProductForTransfer: Product | null;
  otherShopkeepers: ShopkeeperData[];
  transferError: string | null;
  transferLoading: boolean;
  handleInitiateTransfer: (product: Product) => void;
  handleSendTransferRequest: (data: { quantity: number; targetShopkeeperId: string }) => Promise<boolean>;
  handleCloseTransferModal: () => void;
}

export const useProductTransfer = (currentShopkeeperId: string | null, onTransferSuccess?: () => void): UseProductTransferResult => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState<Product | null>(null);
  const [otherShopkeepers, setOtherShopkeepers] = useState<ShopkeeperData[]>([]);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false); // Corrected setter name

  useEffect(() => {
    const fetchOtherShopkeepers = async () => {
      if (!currentShopkeeperId) {
        setOtherShopkeepers([]);
        return;
      }
      try {
        const allShops = await shopkeepersApi.getAll(1, 1000);
        const filteredShops = allShops.shopkeepers.filter((shop: ShopkeeperData) => shop.id !== currentShopkeeperId);
        setOtherShopkeepers(filteredShops);
      } catch (err: any) {
        console.error('Failed to fetch other shopkeepers:', err);
        setTransferError('Failed to load other shops for transfer.');
      }
    };

    fetchOtherShopkeepers();
  }, [currentShopkeeperId]);

  const handleInitiateTransfer = useCallback((product: Product) => {
    setSelectedProductForTransfer(product);
    setTransferError(null);
    setShowTransferModal(true);
  }, []);

  const handleCloseTransferModal = useCallback(() => {
    setShowTransferModal(false);
    setSelectedProductForTransfer(null);
  }, []);

  const handleSendTransferRequest = useCallback(async (data: { quantity: number; targetShopkeeperId: string }): Promise<boolean> => {
    if (!selectedProductForTransfer) {
      setTransferError('No product selected for transfer.');
      return false;
    }

    setTransferLoading(true); // Corrected setter name
    setTransferError(null);

    const payload: CreateProductRequestPayload = {
      productId: selectedProductForTransfer.id,
      requesterId: data.targetShopkeeperId,
      quantity: data.quantity,
    };

    try {
      await productRequestsApi.createExportRequest(payload);
      alert('Product transfer request sent successfully!');
      handleCloseTransferModal();
      onTransferSuccess?.();
      return true;
    } catch (err: any) {
      console.error('Failed to send transfer request:', err);
      setTransferError(err?.response?.data?.message || 'Failed to send transfer request.');
      return false;
    } finally {
      setTransferLoading(false); // Corrected setter name
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
  };
};
