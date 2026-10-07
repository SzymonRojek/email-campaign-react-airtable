import {
  formatMobileNumber,
  formattedData,
  getFilteredDataByStatus,
  sortByDate,
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

  it("formats the date and the time in one text", () => {
    const date = new Date(2022, 8, 6, 21, 5).toISOString();

    expect(formattedData.getFormattedDateTime(date)).toBe("2022/09/06, 9:05 pm");
  });

  it("formats midnight and noon like moment did", () => {
    expect(formattedData.getFormattedTime(new Date(2022, 0, 1, 0, 0).toISOString())).toBe("12:00 am");
    expect(formattedData.getFormattedTime(new Date(2022, 0, 1, 12, 30).toISOString())).toBe("12:30 pm");
  });

  it("returns 'Invalid date' for a value that is not a date", () => {
    expect(formattedData.getFormattedDate("not a date")).toBe("Invalid date");
    expect(formattedData.getFormattedTime("not a date")).toBe("Invalid date");
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

describe("sortByDate", () => {
  const data = [
    subscriber("old", "active", "2022-01-01T00:00:00.000Z"),
    subscriber("new", "active", "2022-03-01T00:00:00.000Z"),
    subscriber("mid", "active", "2022-02-01T00:00:00.000Z"),
  ];
  const ids = (items: Subscriber[]) => items.map(({ id }) => id);

  it("puts the newest first without changing the input", () => {
    expect(ids(sortByDate(data, "newest"))).toEqual(["new", "mid", "old"]);
    expect(ids(data)).toEqual(["old", "new", "mid"]);
  });

  it("puts the oldest first", () => {
    expect(ids(sortByDate(data, "oldest"))).toEqual(["old", "mid", "new"]);
  });

  it("uses the date field before the Airtable creation time", () => {
    const withDate = {
      ...subscriber("dated", "active", "2022-01-01T00:00:00.000Z"),
    };
    withDate.fields = { ...withDate.fields, date: "2022-04-01T00:00:00.000Z" };

    expect(ids(sortByDate([...data, withDate], "newest"))[0]).toBe("dated");
  });
});
