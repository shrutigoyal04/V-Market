// frontend/src/components/PaginationControls.tsx
import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="itemsPerPage" className="text-gray-700 text-sm">Items per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {/* Reverting to default 10 options, and adding 12 as an option */}
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={12}>12</option> {/* Added 12 as requested */}
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Page navigation controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        >
          Next
        </button>
      </nav>

      {/* Displaying total items info */}
      <div className="text-gray-700 text-sm">
        Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} items
      </div>
    </div>
  );
};

export default PaginationControls;
