import { act, renderHook } from "@testing-library/react";

import { Subscriber, SubscriberStatus } from "types";
import { useTableData } from "./useTableData";

// day 1..12 of January, every third one pending
const items: Subscriber[] = Array.from({ length: 12 }, (_, index) => ({
  id: `day${index + 1}`,
  createdTime: new Date(Date.UTC(2022, 0, index + 1)).toISOString(),
  fields: {
    name: "Anna",
    surname: "Nowak",
    email: "a@b.pl",
    status: (index % 3 === 0 ? "pending" : "active") as SubscriberStatus,
  },
}));

const ids = (rows: Subscriber[]) => rows.map(({ id }) => id);

describe("useTableData", () => {
  it("shows all statuses, newest first", () => {
    const { result } = renderHook(() => useTableData(items));

    expect(result.current.status).toBe("all");
    expect(result.current.rows).toHaveLength(12);
    // 10 rows per page
    expect(ids(result.current.pageData)).toHaveLength(10);
    expect(ids(result.current.pageData).slice(0, 3)).toEqual(["day12", "day11", "day10"]);
  });

  it("switches to the oldest first and back to the first page", () => {
    const { result } = renderHook(() => useTableData(items));

    act(() => result.current.setPage(2));
    act(() => result.current.toggleDirection());

    expect(result.current.direction).toBe("oldest");
    expect(result.current.page).toBe(1);
    expect(ids(result.current.pageData).slice(0, 3)).toEqual(["day1", "day2", "day3"]);
  });

  it("filters by status from the first page and keeps the order", () => {
    const { result } = renderHook(() => useTableData(items));

    act(() => result.current.toggleDirection());
    act(() => result.current.setPage(2));
    act(() => result.current.setStatus("pending"));

    expect(result.current.page).toBe(1);
    expect(result.current.direction).toBe("oldest");
    expect(ids(result.current.rows)).toEqual(["day1", "day4", "day7", "day10"]);
  });
});
