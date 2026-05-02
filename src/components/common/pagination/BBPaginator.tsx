export interface BBPaginatorProps {
  numPages: number;
  currentPage: number;
  maxPageCount?: number;
  onPageChange: (pageNo: number) => void;
  className?: string;
}

export default function BBPaginator({
  numPages,
  currentPage,
  onPageChange,
  maxPageCount,
  className = "",
}: BBPaginatorProps) {
  const maxPages = maxPageCount ?? 10;
  const totalPages = Math.max(numPages, 1);
  const current = Math.min(Math.max(currentPage, 1), totalPages);

  const maxToRender = useMemo(() => {
    return totalPages <= maxPages ? totalPages : maxPages;
  }, [totalPages, maxPages]);

  const baseButtonClass =
    "px-3 py-2 text-sm border border-default bg-muted hover:bg-elevated " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted";

  const isFirst = current <= 1;
  const isLast = current >= totalPages;

  const pages = useMemo(() => {
    const pages: React.JSX.Element[] = [];

    const startPage = Math.max(current - Math.floor(maxToRender / 2), 1);
    const endPage = Math.min(startPage + maxToRender - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      const isCurrent = current === i;
      pages.push(
        <button
          key={i}
          disabled={isCurrent}
          className={`px-3 py-2 text-sm border border-default ${
            isCurrent
              ? "bg-elevated text-highlighted cursor-default"
              : "bg-muted hover:bg-elevated"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>,
      );
    }

    if (startPage > 1 && totalPages > maxToRender) {
      pages.unshift(
        <span
          key="start-ellipsis"
          className={`px-3 py-2 text-muted hidden sm:inline-flex`}
        >
          ...
        </span>,
      );
    }
    if (endPage < totalPages) {
      pages.push(
        <span
          key="end-ellipsis"
          className={`px-3 py-2 text-muted hidden sm:inline-flex`}
        >
          ...
        </span>,
      );
    }

    return pages;
  }, [totalPages, current, onPageChange, maxToRender]);

  const shiftPage = useCallback(
    (inc: number) => {
      onPageChange(current + inc);
    },
    [current, onPageChange],
  );

  return (
    <div className={`overflow-x-auto scroll-smooth w-full ${className}`}>
      <div className="flex gap-1 mb-0">
        <button
          className={baseButtonClass}
          disabled={isFirst}
          onClick={() => onPageChange(1)}
        >
          First
        </button>
        <button
          className={baseButtonClass}
          disabled={isFirst}
          onClick={() => shiftPage(-1)}
        >
          Prev
        </button>
        {pages}
        <button
          className={baseButtonClass}
          disabled={isLast}
          onClick={() => shiftPage(1)}
        >
          Next
        </button>
        <button
          className={baseButtonClass}
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
      </div>
      <div className="text-sm text-muted mt-2">
        Page {current} of {totalPages}
      </div>
    </div>
  );
}
