import { act, renderHook } from "@testing-library/react";

import { usePaginatedData } from "./usePaginatedData";

const items = Array.from({ length: 10 }, (_, index) => index + 1);

describe("usePaginatedData", () => {
  it("returns the first page and the number of pages", () => {
    const { result } = renderHook(() => usePaginatedData(items, 4));

    expect(result.current.pageData).toEqual([1, 2, 3, 4]);
    expect(result.current.pageCount).toBe(3);
  });

  it("goes to another page", () => {
    const { result } = renderHook(() => usePaginatedData(items, 4));

    act(() => result.current.setPage(3));

    expect(result.current.page).toBe(3);
    expect(result.current.pageData).toEqual([9, 10]);
  });

  it("stays on a real page when the last items are removed", () => {
    const { result, rerender } = renderHook(
      ({ data }) => usePaginatedData(data, 4),
      { initialProps: { data: items } }
    );

    act(() => result.current.setPage(3));
    rerender({ data: items.slice(0, 8) });

    expect(result.current.page).toBe(2);
    expect(result.current.pageData).toEqual([5, 6, 7, 8]);
  });

  it("has one page for an empty list", () => {
    const { result } = renderHook(() => usePaginatedData([], 4));

    expect(result.current.pageCount).toBe(1);
    expect(result.current.pageData).toEqual([]);
  });
});
