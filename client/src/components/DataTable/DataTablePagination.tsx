import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PAGE_SIZES = [4, 6, 8, 10];

interface DataTablePaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  total: number;
}

const DataTablePagination = ({
  page,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
}: DataTablePaginationProps) => {
  const sizes = [...PAGE_SIZES, total].filter(
    (size, index, all) => size > 0 && all.indexOf(size) === index
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Rows</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger aria-label="Rows per page" className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size === total && !PAGE_SIZES.includes(size)
                  ? `all (${size})`
                  : size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="previous page"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <Button
                key={number}
                variant={number === page ? "default" : "ghost"}
                size="icon"
                aria-label={`page ${number}`}
                aria-current={number === page ? "page" : undefined}
                onClick={() => onPageChange(number)}
              >
                {number}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            aria-label="next page"
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight />
          </Button>
        </nav>
      )}
    </div>
  );
};

export default DataTablePagination;
