import { useMemo, useState } from "react";

// client-side pagination of an already loaded list
export const usePaginatedData = <T>(data: T[], pageSize: number) => {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  // e.g. the last item of the last page was removed - stay on a real page
  const currentPage = Math.min(page, pageCount);

  const pageData = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize]
  );

  return { page: currentPage, pageCount, pageData, setPage };
};
