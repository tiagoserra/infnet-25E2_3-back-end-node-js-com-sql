import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';
import type { Pagination as PaginationType } from '../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange, className = '' }) => {
  const { page, totalPages, hasPrev, hasNext } = pagination;

  if (totalPages <= 1) return null;

  const handlePageClick = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const renderPageItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <BSPagination.Item
          key={1}
          active={page === 1}
          onClick={() => handlePageClick(1)}
        >
          1
        </BSPagination.Item>
      );
      
      if (startPage > 2) {
        items.push(<BSPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Visible page range
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <BSPagination.Item
          key={i}
          active={page === i}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </BSPagination.Item>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BSPagination.Ellipsis key="end-ellipsis" />);
      }
      
      items.push(
        <BSPagination.Item
          key={totalPages}
          active={page === totalPages}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </BSPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className={`d-flex justify-content-between align-items-center ${className}`}>
      <div className="text-muted small">
        Mostrando página {page} de {totalPages} 
        <span className="mx-2">•</span>
        Total: {pagination.total} registros
      </div>
      
      <BSPagination className="mb-0">
        <BSPagination.First
          disabled={!hasPrev}
          onClick={() => handlePageClick(1)}
        />
        <BSPagination.Prev
          disabled={!hasPrev}
          onClick={() => handlePageClick(page - 1)}
        />
        
        {renderPageItems()}
        
        <BSPagination.Next
          disabled={!hasNext}
          onClick={() => handlePageClick(page + 1)}
        />
        <BSPagination.Last
          disabled={!hasNext}
          onClick={() => handlePageClick(totalPages)}
        />
      </BSPagination>
    </div>
  );
};

export default Pagination;