import { axiosInstance } from "../controllers/axiosInstance";
import { getAllRecords } from "../helpers/getAllRecords";
import { AirtableRecord } from "../types";
import { seedCampaigns, seedSubscribers, toAirtableFields } from "./seedData";

// Airtable: max 10 records per create/delete request, max 5 requests per second
const BATCH_SIZE = 10;
const MAX_SEED_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const tables = [
  { endpoint: "/subscribers", seed: seedSubscribers },
  { endpoint: "/campaigns", seed: seedCampaigns },
];

type Fields = Record<string, unknown>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chunks = <T>(items: T[]) =>
  Array.from({ length: Math.ceil(items.length / BATCH_SIZE) }, (_, i) =>
    items.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  );

// the content of a table in a stable order - only the columns the examples have
// (not the dates, not extra Airtable columns like "Last Modified")
const fingerprint = (fieldsList: Fields[], columns: string[]) =>
  fieldsList
    .map((fields) => JSON.stringify(columns.map((column) => fields[column] ?? null)))
    .sort()
    .join("\n");

const isUntouched = (records: AirtableRecord[], seed: { fields: object }[]) => {
  const columns = [
    ...new Set(seed.flatMap((record) => Object.keys(record.fields))),
  ].sort();

  return (
    fingerprint(records.map((record) => record.fields), columns) ===
    fingerprint(seed.map((record) => record.fields as Fields), columns)
  );
};

export type ResetResult = "reset" | "skipped";

/**
 * Brings the demo data back: creates the seed again and deletes the old records.
 * Skipped when nobody changed the data (saves Airtable API calls), unless the
 * examples are older than 7 days (their dates would start to look old).
 */
export const resetDemoData = async ({
  now = new Date(),
  force = false,
  pauseMs = 250,
} = {}): Promise<ResetResult> => {
  const current = await Promise.all(
    tables.map(({ endpoint }) => getAllRecords(endpoint))
  );

  const untouched = tables.every(({ seed }, i) => isUntouched(current[i], seed));
  const oldest = Math.min(
    ...current.flat().map((record) => Date.parse(record.createdTime))
  );
  const tooOld = now.getTime() - oldest > MAX_SEED_AGE_MS;

  if (!force && untouched && !tooOld) return "skipped";

  // create first, delete after - when Airtable refuses the new records
  // (e.g. a renamed column), the old data stays instead of an empty table
  for (const [i, { endpoint, seed }] of tables.entries()) {
    for (const batch of chunks(seed)) {
      await axiosInstance.post(endpoint, {
        records: batch.map((record) => ({ fields: toAirtableFields(record, now) })),
      });
      await wait(pauseMs);
    }

    for (const ids of chunks(current[i].map((record) => record.id))) {
      await axiosInstance.delete(endpoint, { params: { records: ids } });
      await wait(pauseMs);
    }
  }

  return "reset";
};
