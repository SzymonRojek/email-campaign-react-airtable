import { ValidationError } from "yup";

import { formattedData, normalizeText, validationCandidate } from "helpers";
import { toCsv } from "helpers/csv";
import { Candidate, CandidateFormValues, CandidateStatus } from "types";

// the same limit as the server (POST /api/candidates/import)
export const MAX_IMPORT_ROWS = 100;

export const CANDIDATE_COLUMNS = [
  "name",
  "surname",
  "email",
  "status",
  "role",
  "expectedSalary",
  "phone",
] as const;

// a file brings only the person's data - the status is chosen once for the whole
// import (a CSV column can not say who agreed to get e-mails)
export const IMPORT_COLUMNS = CANDIDATE_COLUMNS.filter((column) => column !== "status");

const REQUIRED_COLUMNS = ["name", "surname", "email"];

// what an import can make of the new candidates
export const IMPORT_STATUSES = ["awaiting consent", "open to offers"] as const satisfies readonly CandidateStatus[];
export type ImportStatus = (typeof IMPORT_STATUSES)[number];

// what the list shows (filtered and sorted), plus when the candidate was added
export const candidatesToCsv = (candidates: Candidate[]) =>
  toCsv([
    [...CANDIDATE_COLUMNS, "date"],
    ...candidates.map(({ fields, createdTime }) => [
      ...CANDIDATE_COLUMNS.map((column) => fields[column] ?? ""),
      formattedData.getFormattedDateTime(fields.date || createdTime),
    ]),
  ]);

export const templateCsv = () =>
  toCsv([
    [...IMPORT_COLUMNS],
    ["Emma", "Johnson", "emma.johnson@example.com", "tester", "6500", "5012345671"],
    ["Liam", "Smith", "liam.smith@example.com", "", "", ""],
  ]);

export type ImportFields = Omit<CandidateFormValues, "status">;

export interface ImportRow {
  // the line in the file (1 = the header)
  line: number;
  fields: ImportFields;
  errors: string[];
}

export type ReadCsvResult =
  | { rows: ImportRow[]; ignoresStatus: boolean; error?: undefined }
  | { rows: []; ignoresStatus: false; error: string };

// our export protects formulas with "'" - take it away again
const unprotect = (value: string) => value.trim().replace(/^'(?=[=+\-@])/, "");

const validationErrors = (values: unknown) => {
  try {
    validationCandidate.validateSync(values, { abortEarly: false });
    return [];
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;

    // one message per field is enough in the preview
    const byField = new Map<string, string>();
    error.inner.forEach(({ path = "", message }) => {
      if (!byField.has(path)) byField.set(path, `${path}: ${message}`);
    });
    return [...byField.values()];
  }
};

// the rows of an uploaded CSV, each checked like the "Add candidate" form
export const readCandidatesCsv = (
  rows: string[][],
  existingEmails: Set<string>
): ReadCsvResult => {
  if (rows.length < 2) {
    return { rows: [], ignoresStatus: false, error: "The file has no candidates - only a header or nothing." };
  }

  const header = rows[0].map(normalizeText);
  const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));

  if (missing.length) {
    return { rows: [], ignoresStatus: false, error: `Missing columns: ${missing.join(", ")}.` };
  }

  const dataRows = rows.slice(1);

  if (dataRows.length > MAX_IMPORT_ROWS) {
    return {
      rows: [],
      ignoresStatus: false,
      error: `At most ${MAX_IMPORT_ROWS} candidates at once - the file has ${dataRows.length}.`,
    };
  }

  const seen = new Set<string>();

  return {
    // e.g. a file from our export - its status column is not used
    ignoresStatus: header.includes("status"),
    rows: dataRows.map((cells, index) => {
      const value = (column: string) => {
        // the header is compared without letter case - "expectedSalary" or "ExpectedSalary"
        const position = header.indexOf(normalizeText(column));
        return position === -1 ? "" : unprotect(cells[position] ?? "");
      };

      const fields = Object.fromEntries(
        IMPORT_COLUMNS.map((column) => [column, value(column)])
      ) as ImportFields;

      // the form rules; the status is checked by the import's own choice
      const errors = validationErrors({ ...fields, status: "awaiting consent" });
      const email = normalizeText(fields.email);

      if (existingEmails.has(email)) errors.push("email: already on the list");
      else if (seen.has(email)) errors.push("email: twice in the file");
      seen.add(email);

      return { line: index + 2, fields, errors };
    }),
  };
};
