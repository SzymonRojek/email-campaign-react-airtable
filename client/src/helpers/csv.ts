// CSV for the subscribers export / import - small enough to not need a library

// a cell starting with = + - @ would run as a formula in Excel / Google Sheets
const FORMULA_START = /^[=+\-@\t\r]/;
const NEEDS_QUOTES = /[",;\r\n]/;

export const toCsvCell = (value: unknown) => {
  let text = value === undefined || value === null ? "" : String(value);

  if (FORMULA_START.test(text)) text = `'${text}`;

  return NEEDS_QUOTES.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// the BOM makes Excel read the Polish letters as UTF-8
export const toCsv = (rows: unknown[][]) =>
  "\uFEFF" + rows.map((row) => row.map(toCsvCell).join(",")).join("\r\n") + "\r\n";

// Excel with Polish settings saves "name;surname" - use the one the header uses more
const detectDelimiter = (firstLine: string) =>
  (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";

export const parseCsv = (input: string): string[][] => {
  const text = input.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(text.split(/\r?\n/, 1)[0] ?? "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    // skip empty lines
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      endCell();
    } else if (char === "\n") {
      endRow();
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell !== "" || row.length > 0) endRow();

  return rows;
};

// the browser saves the text as a file
export const downloadCsv = (fileName: string, csv: string) => {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
