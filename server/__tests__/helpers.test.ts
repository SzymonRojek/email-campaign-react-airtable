import { AxiosError } from "axios";

import { sortDataAlphabetically } from "../helpers/sortDataAlphabetically";
import { capitalizeFirstLetter } from "../helpers/capitalizeFirstLetter";
import { getErrorMessage } from "../helpers/getErrorMessage";

const record = (fields: Record<string, unknown>, id = "rec1") => ({
  id,
  createdTime: "2022-01-01T00:00:00.000Z",
  fields,
});

describe("sortDataAlphabetically", () => {
  it("sorts subscribers by name, case insensitive", () => {
    const data = [
      record({ name: "zoe" }, "1"),
      record({ name: "Adam" }, "2"),
      record({ name: "matt" }, "3"),
    ];

    expect(sortDataAlphabetically(data).map((item) => item.id)).toEqual([
      "2",
      "3",
      "1",
    ]);
  });

  it("sorts Polish letters next to their base letters", () => {
    const data = [
      record({ name: "Zenon" }, "1"),
      record({ name: "Łucja" }, "2"),
      record({ name: "Lena" }, "3"),
    ];

    expect(sortDataAlphabetically(data).map((item) => item.fields.name)).toEqual([
      "Lena",
      "Łucja",
      "Zenon",
    ]);
  });

  it("sorts campaigns by title when there are no names", () => {
    const data = [record({ title: "b" }, "1"), record({ title: "A" }, "2")];

    expect(sortDataAlphabetically(data).map((item) => item.id)).toEqual([
      "2",
      "1",
    ]);
  });

  it("does not crash on records without name or title", () => {
    const data = [record({ name: "Bob" }, "1"), record({}, "2")];

    expect(() => sortDataAlphabetically(data)).not.toThrow();
  });

  it("does not mutate the passed array", () => {
    const data = [record({ name: "b" }, "1"), record({ name: "a" }, "2")];

    sortDataAlphabetically(data);

    expect(data[0].id).toBe("1");
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes only the first letter and keeps the rest", () => {
    expect(capitalizeFirstLetter("black Friday")).toBe("Black Friday");
  });

  it("returns undefined for an empty value", () => {
    expect(capitalizeFirstLetter("")).toBeUndefined();
    expect(capitalizeFirstLetter(undefined)).toBeUndefined();
  });
});

describe("getErrorMessage", () => {
  const axiosError = (data: unknown) =>
    Object.assign(new Error("Request failed"), {
      config: { headers: { Authorization: "Bearer patSECRET" } },
      response: { status: 422, data },
    }) as unknown as AxiosError;

  it("returns the Airtable error message", () => {
    expect(
      getErrorMessage(axiosError({ error: { message: "Invalid field" } }))
    ).toBe("Invalid field");
  });

  it("returns a plain Airtable error string", () => {
    expect(getErrorMessage(axiosError({ error: "NOT_FOUND" }))).toBe(
      "NOT_FOUND"
    );
  });

  it("falls back to the error message", () => {
    expect(getErrorMessage(new Error("connect ECONNREFUSED"))).toBe(
      "connect ECONNREFUSED"
    );
  });

  it("never exposes the Airtable token", () => {
    const message = getErrorMessage(axiosError({}));

    expect(JSON.stringify(message)).not.toContain("patSECRET");
  });
});
