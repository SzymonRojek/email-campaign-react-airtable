import { parseCsv, toCsv, toCsvCell } from "./csv";

describe("toCsvCell", () => {
  it("quotes cells with a comma, a quote or a new line", () => {
    expect(toCsvCell("plain")).toBe("plain");
    expect(toCsvCell("Nowak, Anna")).toBe('"Nowak, Anna"');
    expect(toCsvCell('say "hi"')).toBe('"say ""hi"""');
    expect(toCsvCell("two\nlines")).toBe('"two\nlines"');
  });

  it("does not let a cell run as a formula in Excel", () => {
    expect(toCsvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(toCsvCell("+48")).toBe("'+48");
    expect(toCsvCell("@user")).toBe("'@user");
  });

  it("writes empty cells for missing values", () => {
    expect(toCsvCell(undefined)).toBe("");
    expect(toCsvCell(null)).toBe("");
  });
});

describe("toCsv", () => {
  it("starts with a BOM (Polish letters in Excel) and ends lines with CRLF", () => {
    expect(toCsv([["name"], ["Łucja"]])).toBe("\uFEFFname\r\nŁucja\r\n");
  });
});

describe("parseCsv", () => {
  it("reads quoted cells, escaped quotes and CRLF", () => {
    expect(parseCsv('name,note\r\n"Nowak, Anna","say ""hi"""\r\n')).toEqual([
      ["name", "note"],
      ["Nowak, Anna", 'say "hi"'],
    ]);
  });

  it("reads files with ; (Excel with Polish settings)", () => {
    expect(parseCsv("name;email\nAnna;a@b.pl")).toEqual([
      ["name", "email"],
      ["Anna", "a@b.pl"],
    ]);
  });

  it("skips the BOM and empty lines", () => {
    expect(parseCsv("\uFEFFname\n\nAnna\n\n")).toEqual([["name"], ["Anna"]]);
  });

  it("keeps a new line inside quotes", () => {
    expect(parseCsv('note\n"two\nlines"')).toEqual([["note"], ["two\nlines"]]);
  });

  it("reads back what toCsv wrote", () => {
    const rows = [["name", "note"], ["Łucja", 'a, "b"']];

    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});
