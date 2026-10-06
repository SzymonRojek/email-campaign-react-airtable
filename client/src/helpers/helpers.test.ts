import {
  formatMobileNumber,
  formattedData,
  getFilteredDataByStatus,
  getLatestAddedItem,
} from "helpers";
import { Subscriber } from "types";

const subscriber = (
  id: string,
  status: Subscriber["fields"]["status"],
  createdTime: string
): Subscriber => ({
  id,
  createdTime,
  fields: { name: "Anna", surname: "Nowak", email: "a@b.pl", status },
});

describe("formatMobileNumber", () => {
  it("formats 10 digits", () => {
    expect(formatMobileNumber("3432342344")).toBe("(343) 234-2344");
    expect(formatMobileNumber("343-234-2344")).toBe("(343) 234-2344");
  });

  it("returns an empty string for an invalid number", () => {
    expect(formatMobileNumber("123")).toBe("");
    expect(formatMobileNumber(undefined)).toBe("");
  });
});

describe("formattedData", () => {
  it("formats the date and the time", () => {
    const date = new Date(2022, 8, 6, 21, 5).toISOString();

    expect(formattedData.getFormattedDate(date)).toBe("2022/09/06");
    expect(formattedData.getFormattedTime(date)).toBe("9:05 pm");
  });
});

describe("getFilteredDataByStatus", () => {
  it("keeps only items with the status", () => {
    const data = [
      subscriber("1", "active", "2022-01-01"),
      subscriber("2", "blocked", "2022-01-02"),
    ];

    expect(getFilteredDataByStatus(data, "active").map(({ id }) => id)).toEqual(
      ["1"]
    );
  });

  it("returns an empty array without data", () => {
    expect(getFilteredDataByStatus(undefined, "active")).toEqual([]);
  });
});

describe("getLatestAddedItem", () => {
  it("returns the newest item without changing the input", () => {
    const data = [
      subscriber("old", "active", "2022-01-01T00:00:00.000Z"),
      subscriber("new", "active", "2022-03-01T00:00:00.000Z"),
      subscriber("mid", "active", "2022-02-01T00:00:00.000Z"),
    ];

    expect(getLatestAddedItem(data).map(({ id }) => id)).toEqual(["new"]);
    expect(data[0].id).toBe("old");
  });

  it("returns an empty array without data", () => {
    expect(getLatestAddedItem(undefined)).toEqual([]);
  });
});
