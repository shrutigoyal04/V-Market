// frontend/src/components/ProductTransferModal.tsx
import React, { useEffect } from 'react'; // Added useEffect
import { Product } from '@/types/product';
import { ShopkeeperData } from '@/api/shopkeepers.api';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import z from zod
import { useState, useMemo, useRef, useCallback } from 'react'; // Import useState and useMemo for search

interface ProductTransferModalProps {
  show: boolean;
  product: Product | null;
  otherShopkeepers: ShopkeeperData[];
  error: string | null;
  loading: boolean;
  // Renamed from onSendRequest and changed signature to receive validated data
  onSubmit: (data: { quantity: number; targetShopkeeperId: string }) => Promise<void>;
  onClose: () => void;
}

const ProductTransferModal: React.FC<ProductTransferModalProps> = ({
  show,
  product,
  otherShopkeepers,
  error,
  loading,
  onSubmit, // New onSubmit prop
  onClose,
}) => {
  // Define the Zod schema for product transfer validation dynamically
  const transferSchema = z.object({
    quantity: z.preprocess(
      (val) => Number(val),
      z.number()
        .min(1, 'Quantity must be at least 1')
        .max(product?.quantity || 0, `Quantity cannot exceed available stock (${product?.quantity})`)
        .refine((val) => !isNaN(val), 'Quantity must be a number')
    ),
    targetShopkeeperId: z.string().min(1, 'Please select a shop to transfer to'),
  });

  // Infer the type for the form inputs
  type TransferFormInputs = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset form when product changes or modal closes
    setValue, // Import setValue to programmatically set form values
    watch // To watch targetShopkeeperId for displaying selected shop
  } = useForm<TransferFormInputs>({
    resolver: zodResolver(transferSchema), // Integrate Zod resolver
    defaultValues: {
      quantity: 1, // Default quantity
      targetShopkeeperId: '', // Default empty selection
    },
  });

  const [shopSearchTerm, setShopSearchTerm] = useState(''); // State for shop search input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside
  const inputRef = useRef<HTMLInputElement>(null); // New ref for the input field

  const currentTargetShopkeeperId = watch('targetShopkeeperId'); // Watch the selected shop ID

  // Memoize filtered shopkeepers based on search term
  const filteredShops = useMemo(() => {
    if (!otherShopkeepers) return [];
    // Only filter if there's a search term or a selected shop
    if (!shopSearchTerm && !currentTargetShopkeeperId) {
        return otherShopkeepers; // Show all if nothing typed and nothing selected
    }
    return otherShopkeepers.filter(shop =>
      shop.shopName.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(shopSearchTerm.toLowerCase())
    );
  }, [otherShopkeepers, shopSearchTerm, currentTargetShopkeeperId]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the dropdown container and the input field
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
  useEffect(() => {
    if (show && product) {
      reset({
        quantity: 1,
        targetShopkeeperId: '',
      });
      setShopSearchTerm(''); // Reset search term
      setIsDropdownOpen(false); // Ensure dropdown is closed on modal open
    }
  }, [show, product, reset]);

  // Update input field display when currentTargetShopkeeperId changes (e.g., on selection)
  useEffect(() => {
    const selectedShop = otherShopkeepers.find(shop => shop.id === currentTargetShopkeeperId);
    if (selectedShop) {
      // Only update if the current input value doesn't already match to avoid flicker
      if (shopSearchTerm !== selectedShop.shopName) {
        setShopSearchTerm(selectedShop.shopName);
      }
    } else if (shopSearchTerm && !isDropdownOpen) {
        // If there's text in the input but no corresponding shop selected (e.g., after blur and no selection)
        // clear the input to indicate no valid selection
        setShopSearchTerm('');
    }
  }, [currentTargetShopkeeperId, otherShopkeepers, shopSearchTerm, isDropdownOpen]);


  const handleShopSelect = useCallback((shop: ShopkeeperData) => {
    setValue('targetShopkeeperId', shop.id, { shouldValidate: true }); // Set value and trigger validation
    setShopSearchTerm(shop.shopName); // Display selected shop's name in input
    setIsDropdownOpen(false); // Close dropdown immediately on selection
  }, [setValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopSearchTerm(value);
    // Always clear targetShopkeeperId when typing in the input
    setValue('targetShopkeeperId', '');
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true); // Open dropdown on focus
  };

  // The onBlur event needs careful handling to allow click events to fire
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
        return; // Do nothing if focus is moving to an item in the dropdown
    }
    if (!currentTargetShopkeeperId) {
        setShopSearchTerm('');
    }
    setIsDropdownOpen(false);
  };


  const handleFormSubmit = async (data: TransferFormInputs) => {
    await onSubmit(data);
  };

  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-white-50 bg-opacity-0 backdrop-blur-[2px] overflow-y-auto h-full w-full flex justify-center items-center"> {/* Changed bg-opacity-0 to bg-opacity-25 and added backdrop-blur-sm */}
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="mt-2 text-center text-2xl font-bold mb-4 text-gray-900">Transfer Product: {product.name}</h2> {/* Adjusted heading style */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8 space-y-6"> {/* Form wrapper with space-y-6 */}
          <div className="space-y-4"> {/* Grouping for input fields */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity (Available: {product.quantity}):</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity')}
                min="1"
                max={product.quantity}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Updated input style
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
            <div className="relative" ref={dropdownRef}> {/* Added relative positioning and ref */}
              <label htmlFor="shopSearch" className="block text-gray-700 text-sm font-bold mb-2">Transfer to Shop:</label>
              <input
                type="text"
                id="shopSearch"
                placeholder="Search or select a shop"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={shopSearchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur} // Apply the refined onBlur handler
                autoComplete="off" // Prevent browser autocomplete
                ref={inputRef} // Assign inputRef
              />
              {isDropdownOpen && filteredShops.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredShops.map(shop => (
                    <li
                      key={shop.id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      // Use onMouseDown to prevent blur from firing before click on the list item
                      onMouseDown={(e) => e.preventDefault()} // Prevents input blur on click
                      onClick={() => handleShopSelect(shop)}
                    >
                      {shop.shopName} ({shop.email})
                    </li>
                  ))}
                </ul>
              )}
              {errors.targetShopkeeperId && (
                <p className="mt-1 text-sm text-red-600">{errors.targetShopkeeperId.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200" // Adjusted cancel button style
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // Updated submit button style
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductTransferModal;