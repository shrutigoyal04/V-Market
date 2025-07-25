// frontend/src/hooks/useProductTransferForm.ts
'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/product';
import { ShopkeeperData } from '@/api/shopkeepers.api';

// Define the Zod schema for product transfer validation
// This will be dynamic based on the product's available quantity
const createTransferSchema = (productQuantity: number | undefined) => z.object({
  quantity: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(1, 'Quantity must be at least 1')
      .max(productQuantity || 0, `Quantity cannot exceed available stock (${productQuantity})`)
      .refine((val) => !isNaN(val), 'Quantity must be a number')
  ),
  targetShopkeeperId: z.string().min(1, 'Please select a shop to transfer to'),
});

// Infer the type from the schema creator function
type TransferFormInputs = z.infer<ReturnType<typeof createTransferSchema>>;

interface UseProductTransferFormProps {
  product: Product | null;
  otherShopkeepers: ShopkeeperData[];
  showModal: boolean; // Prop to know when modal is shown/hidden for reset
}

interface UseProductTransferFormResult {
  register: any; // Type from react-hook-form
  handleSubmit: any; // Type from react-hook-form
  errors: any; // Type from react-hook-form
  setValue: any; // Type from react-hook-form
  watch: any; // Type from react-hook-form
  shopSearchTerm: string;
  isDropdownOpen: boolean;
  filteredShops: ShopkeeperData[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleShopSelect: (shop: ShopkeeperData) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>; // Changed type here
  inputRef: React.RefObject<HTMLInputElement | null>; // Changed type here
  resetForm: () => void; // Expose reset function
}

export const useProductTransferForm = ({ product, otherShopkeepers, showModal }: UseProductTransferFormProps): UseProductTransferFormResult => {
  const transferSchema = useMemo(() => createTransferSchema(product?.quantity), [product?.quantity]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TransferFormInputs>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      quantity: 1,
      targetShopkeeperId: '',
    },
  });

  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTargetShopkeeperId = watch('targetShopkeeperId');

  const filteredShops = useMemo(() => {
    if (!otherShopkeepers) return [];
    if (!shopSearchTerm) return otherShopkeepers;
    return otherShopkeepers.filter(shop =>
      shop.shopName.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(shopSearchTerm.toLowerCase())
    );
  }, [otherShopkeepers, shopSearchTerm]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset form and search term when modal opens with a new product or closes
  const resetForm = useCallback(() => {
    reset({
      quantity: 1,
      targetShopkeeperId: '',
    });
    setShopSearchTerm('');
    setIsDropdownOpen(false);
  }, [reset]);

  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal, resetForm]);

  // Update input field display when currentTargetShopkeeperId changes (e.g., on selection)
  useEffect(() => {
    const selectedShop = otherShopkeepers.find(shop => shop.id === currentTargetShopkeeperId);
    if (selectedShop) {
      if (shopSearchTerm !== selectedShop.shopName) {
        setShopSearchTerm(selectedShop.shopName);
      }
    } else if (shopSearchTerm && !isDropdownOpen) {
        setShopSearchTerm('');
    }
  }, [currentTargetShopkeeperId, otherShopkeepers, shopSearchTerm, isDropdownOpen]);

  const handleShopSelect = useCallback((shop: ShopkeeperData) => {
    setValue('targetShopkeeperId', shop.id, { shouldValidate: true });
    setShopSearchTerm(shop.shopName);
    setIsDropdownOpen(false);
  }, [setValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopSearchTerm(value);
    setValue('targetShopkeeperId', '');
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
        return;
    }
    if (!currentTargetShopkeeperId) {
        setShopSearchTerm('');
    }
    setIsDropdownOpen(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    shopSearchTerm,
    isDropdownOpen,
    filteredShops,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleShopSelect,
    dropdownRef,
    inputRef,
    resetForm,
  };
};
