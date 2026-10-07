import { useMemo, useState } from "react";

import { getFilteredDataByStatus, sortByDate } from "helpers";
import { SortDirection } from "helpers/sortByDate";
import { PAGE_SIZES } from "components/DataTable/DataTablePagination";
import { ALL_STATUSES } from "components/DataTable/StatusFilter";
import { AirtableRecord } from "types";
import { usePaginatedData } from "./usePaginatedData";

// a list table: status filter -> sorted by date (newest first) -> pages;
// a new filter, order or page size starts from the first page
export const useTableData = <
  Status extends string,
  T extends AirtableRecord<{ status: Status; date?: string }>,
>(
  items: T[]
) => {
  const [status, setStatusState] = useState<Status | typeof ALL_STATUSES>(
    ALL_STATUSES
  );
  const [direction, setDirection] = useState<SortDirection>("newest");
  const [pageSize, setPageSizeState] = useState(PAGE_SIZES[0]);

  const rows = useMemo(
    () =>
      sortByDate(
        status === ALL_STATUSES ? items : getFilteredDataByStatus(items, status),
        direction
      ),
    [items, status, direction]
  );
  const { page, pageCount, pageData, setPage } = usePaginatedData(rows, pageSize);

  return {
    rows,
    pageData,
    page,
    pageCount,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSizeState(size);
      setPage(1);
    },
    status,
    setStatus: (next: Status | typeof ALL_STATUSES) => {
      setStatusState(next);
      setPage(1);
    },
    direction,
    toggleDirection: () => {
      setDirection((current) => (current === "newest" ? "oldest" : "newest"));
      setPage(1);
    },
  };
};
