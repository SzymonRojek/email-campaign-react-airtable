import api from "./api";
import { ImportFields, ImportStatus } from "components/candidates/candidatesCsv";

export interface ImportResult {
  created: number;
  // rows the server did not add, e.g. an e-mail added in the meantime
  skipped: { row: number; email: string; reason: string }[];
}

// the status is one for the whole import - the rows bring only the person's data
const importCandidates = (candidates: ImportFields[], status: ImportStatus) =>
  api.post<ImportResult>("/candidates/import", { candidates, status });

export default importCandidates;
