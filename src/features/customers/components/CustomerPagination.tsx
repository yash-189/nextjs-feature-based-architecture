import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/ui/primitives/button";

interface CustomerPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function CustomerPagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
}: CustomerPaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 text-muted-foreground text-sm"
    >
      <span>
        {totalCount} {totalCount === 1 ? "customer" : "customers"}
      </span>
      <div className="flex items-center gap-2">
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </nav>
  );
}
