// frontend/src/components/ShopSearchInput.tsx
import React from 'react';
import { ShopkeeperData } from '@/api/shopkeepers.api';

interface ShopSearchInputProps {
  label: string;
  searchTerm: string;
  isDropdownOpen: boolean;
  filteredShops: ShopkeeperData[];
  inputRef: React.RefObject<HTMLInputElement | null>; // Changed type here
  dropdownRef: React.RefObject<HTMLDivElement | null>; // Changed type here
  errors: any; // From react-hook-form
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleShopSelect: (shop: ShopkeeperData) => void;
}

const ShopSearchInput: React.FC<ShopSearchInputProps> = ({
  label,
  searchTerm,
  isDropdownOpen,
  filteredShops,
  inputRef,
  dropdownRef,
  errors,
  handleInputChange,
  handleInputFocus,
  handleInputBlur,
  handleShopSelect,
}) => {
  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="shopSearch" className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type="text"
        id="shopSearch"
        placeholder="Search or select a shop"
        className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoComplete="off"
        ref={inputRef}
      />
      {isDropdownOpen && filteredShops.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {filteredShops.map(shop => (
            <li
              key={shop.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleShopSelect(shop)}
            >
              {shop.shopName} ({shop.email})
            </li>
          ))}
        </ul>
      )}
      {isDropdownOpen && filteredShops.length === 0 && searchTerm && (
        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 px-3 py-2 text-gray-500">
          No results found.
        </div>
      )}
      {errors && errors.targetShopkeeperId && (
        <p className="mt-1 text-sm text-red-600">{errors.targetShopkeeperId.message}</p>
      )}
    </div>
  );
};

export default ShopSearchInput; 