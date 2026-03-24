import type { Dispatch, SetStateAction } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="secondary-button"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        type="button"
      >
        Prev
      </button>

      <span className="pagination-copy">Page {page} of {totalPages}</span>

      <button
        className="secondary-button"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
