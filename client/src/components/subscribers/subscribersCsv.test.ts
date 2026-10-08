import { parseCsv } from "helpers/csv";
import { Subscriber } from "types";
import {
  MAX_IMPORT_ROWS,
  readSubscribersCsv,
  subscribersToCsv,
  templateCsv,
} from "./subscribersCsv";

const header = "name,surname,email,profession,salary,telephone";
const row = (email: string) => `Ewa,Nowak,${email},tester,5000,3432342344`;

const read = (csv: string, existing: string[] = []) =>
  readSubscribersCsv(parseCsv(csv), new Set(existing));

describe("readSubscribersCsv", () => {
  it("accepts a valid row", () => {
    const result = read(`${header}\n${row("ewa@example.com")}`);

    expect(result.error).toBeUndefined();
    expect(result.rows).toEqual([
      {
        line: 2,
        errors: [],
        fields: {
          name: "Ewa",
          surname: "Nowak",
          email: "ewa@example.com",
          profession: "tester",
          salary: "5000",
          telephone: "3432342344",
        },
      },
    ]);
  });

  it("checks every row like the form and finds duplicates", () => {
    const result = read(
      [
        header,
        row("not-an-email"),
        row("anna@example.com"),
        row("ewa@example.com"),
        row("EWA@example.com"),
      ].join("\n"),
      ["anna@example.com"]
    );

    expect(result.rows.map(({ line, errors }) => [line, errors])).toEqual([
      [2, ["email: email is invalid"]],
      [3, ["email: already on the list"]],
      [4, []],
      [5, ["email: twice in the file"]],
    ]);
  });

  it("needs only the name, the surname and the e-mail", () => {
    const result = read("name,surname,email\nEwa,Nowak,ewa@example.com");

    expect(result.rows[0].errors).toEqual([]);
    expect(result.rows[0].fields).toMatchObject({ profession: "", salary: "", telephone: "" });
  });

  it("does not use a status column - and says so", () => {
    const result = read("name,surname,email,status\nEwa,Nowak,ewa@example.com,blocked");

    expect(result.ignoresStatus).toBe(true);
    expect(result.rows[0].fields).not.toHaveProperty("status");
    expect(read(`${header}\n${row("ewa@example.com")}`).ignoresStatus).toBe(false);
  });

  it("reads the columns in any order and letter case", () => {
    const result = read("EMAIL,Surname,Name,Profession,Salary,Telephone\newa@example.com,Nowak,Ewa,tester,5000,3432342344");

    expect(result.rows[0].fields).toMatchObject({ name: "Ewa", surname: "Nowak", email: "ewa@example.com" });
  });

  it.each([
    ["an empty file", "", "only a header or nothing"],
    ["only a header", header, "only a header or nothing"],
    ["no e-mail column", "name,surname\nEwa,Nowak", "Missing columns: email."],
  ])("explains %s", (_, csv, message) => {
    expect(read(csv).error).toContain(message);
  });

  it(`refuses more than ${MAX_IMPORT_ROWS} rows`, () => {
    const rows = Array.from({ length: MAX_IMPORT_ROWS + 1 }, (_, i) => row(`u${i}@example.com`));

    expect(read([header, ...rows].join("\n")).error).toContain(`At most ${MAX_IMPORT_ROWS}`);
  });
});

describe("export and template", () => {
  it("exports the subscribers with the date, ready to import again", () => {
    const subscriber: Subscriber = {
      id: "1",
      createdTime: new Date(2022, 8, 6, 21, 5).toISOString(),
      fields: { name: "Łucja", surname: "Zając", email: "lucja@example.com", status: "active", profession: "analyst", salary: "4500", telephone: "3432342399" },
    };
    const rows = parseCsv(subscribersToCsv([subscriber]));

    // the export is a report: it has the status and the date
    expect(rows).toEqual([
      ["name", "surname", "email", "status", "profession", "salary", "telephone", "date"],
      ["Łucja", "Zając", "lucja@example.com", "active", "analyst", "4500", "3432342399", "2022/09/06, 9:05 pm"],
    ]);
    // ... and imports again (the status column is not used)
    const again = readSubscribersCsv(rows, new Set());
    expect(again.rows[0].errors).toEqual([]);
    expect(again.ignoresStatus).toBe(true);
  });

  it("gives a template that passes the import", () => {
    const result = readSubscribersCsv(parseCsv(templateCsv()), new Set());

    // a full row and one with only the required fields - no status column
    expect(result.rows).toHaveLength(2);
    expect(result.rows.map(({ errors }) => errors)).toEqual([[], []]);
    expect(result.ignoresStatus).toBe(false);
  });
});
