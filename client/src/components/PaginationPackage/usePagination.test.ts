import { act, renderHook } from "@testing-library/react-hooks";

import usePagination from "./usePagination";

// arrays are created once - a new array on every render would re-run the effect forever
const items = Array.from({ length: 10 }, (_, index) => index + 1);
const fewItems = [1, 2];

describe("usePagination", () => {
  it("returns the first page and the number of pages", () => {
    const { result } = renderHook(() => usePagination(items, 4, 0));

    expect(result.current.paginatedData).toEqual([1, 2, 3, 4]);
    expect(result.current.paginatorStatus.pages).toBe(3);
  });

  it("goes to the next, a specific and the previous page", () => {
    const { result } = renderHook(() => usePagination(items, 4, 0));

    act(() => result.current.paginatorStatus.handleNextPage());
    expect(result.current.paginatedData).toEqual([5, 6, 7, 8]);

    act(() => result.current.paginatorStatus.handleSpecificPage(3));
    expect(result.current.paginatedData).toEqual([9, 10]);
    expect(result.current.paginatorStatus.lastPage).toBe(true);

    act(() => result.current.paginatorStatus.handlePreviousPage());
    expect(result.current.paginatedData).toEqual([5, 6, 7, 8]);
  });

  it("shows everything on one page when it fits", () => {
    const { result } = renderHook(() => usePagination(fewItems, 4, 0));

    expect(result.current.paginatedData).toEqual([1, 2]);
    expect(result.current.paginatorStatus.pages).toBe(1);
  });
});
