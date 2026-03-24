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
    <div>
      <button disabled={page === 1} onClick={() => setPage(page - 1)} type="button">
        Prev
      </button>
      <span> Page {page} of {totalPages} </span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} type="button">
        Next
      </button>
    </div>
  );
}

export default Pagination;
