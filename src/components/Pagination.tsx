// PaginationControls.tsx or PaginationControls.jsx
import React from 'react';

interface PaginationProps {
  limit: number;
  setLimit: (limit: number) => void;
  page: number;
  setPage: (page: number) => void;
  pages: number;
}

const PaginationControls: React.FC<PaginationProps> = ({
  limit,
  setLimit,
  page,
  setPage,
  pages,
}) => {
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page on limit change
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      {/* Per Page Dropdown */}
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="perPageSelect" className="mb-0 fw-semibold">
          Rows per page:
        </label>
        <select
          id="perPageSelect"
          className="form-select"
          style={{ width: 'auto' }}
          value={limit}
          onChange={handleLimitChange}
        >
          {[5, 10, 20, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* Page Navigation */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page <strong>{page}</strong> of <strong>{pages}</strong>
        </span>

        <button
          className="btn btn-secondary"
          onClick={() => setPage(page + 1)}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
