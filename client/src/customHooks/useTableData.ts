import { useMemo, useState } from "react";

import { getFilteredDataByStatus, normalizeText, sortByDate } from "helpers";
import { SortDirection } from "helpers/sortByDate";
import { DEFAULT_PAGE_SIZE } from "components/DataTable/DataTablePagination";
import { ALL_STATUSES } from "components/DataTable/StatusFilter";
import { AirtableRecord } from "types";
import { usePaginatedData } from "./usePaginatedData";

// a list table: search + status filter -> sorted by date (newest first) -> pages;
// a new search, filter, order or page size starts from the first page
export const useTableData = <
  Status extends string,
  T extends AirtableRecord<{ status: Status; date?: string }>,
>(
  items: T[],
  // the text the search looks in, e.g. name + surname + e-mail
  searchText: (item: T) => string = () => ""
) => {
  const [query, setQueryState] = useState("");
  const [status, setStatusState] = useState<Status | typeof ALL_STATUSES>(
    ALL_STATUSES
  );
  const [direction, setDirection] = useState<SortDirection>("newest");
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

  const rows = useMemo(() => {
    const words = normalizeText(query).split(/\s+/).filter(Boolean);
    const byStatus =
      status === ALL_STATUSES ? items : getFilteredDataByStatus(items, status);
    // every word must match - "anna now" finds Anna Nowak
    const found = words.length
      ? byStatus.filter((item) => {
          const text = normalizeText(searchText(item));
          return words.every((word) => text.includes(word));
        })
      : byStatus;

    return sortByDate(found, direction);
    // searchText is an inline function - the query and the data decide
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, status, direction, query]);
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
    query,
    setQuery: (next: string) => {
      setQueryState(next);
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
