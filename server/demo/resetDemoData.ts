import { axiosInstance } from "../controllers/axiosInstance";
import { chunks, wait } from "../helpers/batches";
import { getAllRecords } from "../helpers/getAllRecords";
import { AirtableRecord } from "../types";
import { seedJobOffers, seedOutbox, seedCandidates, toAirtableFields } from "./seedData";

const MAX_SEED_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// the outbox ("emails") refers to the ids of the other two - it is created after them
const endpoints = ["/candidates", "/jobOffers", "/outbox"] as const;

type Fields = Record<string, unknown>;

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
 * Brings the demo data back: creates the seed again (candidates, job offers and the
 * outbox of the sent ones) and deletes the old records.
 * Skipped when nobody changed the data (saves Airtable API calls), unless the
 * examples are older than 7 days (their dates would start to look old).
 */
export const resetDemoData = async ({
  now = new Date(),
  force = false,
  pauseMs = 250,
} = {}): Promise<ResetResult> => {
  const [candidates, jobOffers, emails] = await Promise.all(
    endpoints.map((endpoint) => getAllRecords(endpoint))
  );
  const outbox = seedOutbox();

  // sending a job offer changes the job offers, deleting one empties its outbox -
  // the number of e-mails is enough to see that the outbox is untouched
  const untouched =
    isUntouched(candidates, seedCandidates) &&
    isUntouched(jobOffers, seedJobOffers) &&
    emails.length === outbox.length;
  const oldest = Math.min(
    ...[...candidates, ...jobOffers].map((record) => Date.parse(record.createdTime))
  );
  const tooOld = now.getTime() - oldest > MAX_SEED_AGE_MS;

  if (!force && untouched && !tooOld) return "skipped";

  // create first, delete after - when Airtable refuses the new records
  // (e.g. a renamed column), the old data stays instead of an empty table
  const create = async (endpoint: string, fieldsList: object[]) => {
    const ids: string[] = [];

    for (const batch of chunks(fieldsList)) {
      const { data } = await axiosInstance.post<{ records: AirtableRecord[] }>(endpoint, {
        records: batch.map((fields) => ({ fields })),
      });
      // Airtable returns the new records in the order they were sent
      ids.push(...data.records.map(({ id }) => id));
      await wait(pauseMs);
    }

    return ids;
  };

  const candidateIds = await create(
    "/candidates",
    seedCandidates.map((record) => toAirtableFields(record, now))
  );
  const jobOfferFields = seedJobOffers.map((record) => toAirtableFields(record, now));
  const jobOfferIds = await create("/jobOffers", jobOfferFields);

  await create(
    "/outbox",
    outbox.map(({ jobOfferIndex, candidateIndex }) => {
      const { name, surname, email } = seedCandidates[candidateIndex].fields;

      return {
        email,
        name: `${name} ${surname}`,
        candidateId: candidateIds[candidateIndex],
        jobOfferId: jobOfferIds[jobOfferIndex],
        sentAt: jobOfferFields[jobOfferIndex].date,
      };
    })
  );

  for (const [i, endpoint] of endpoints.entries()) {
    const old = [candidates, jobOffers, emails][i];

    for (const ids of chunks(old.map((record) => record.id))) {
      await axiosInstance.delete(endpoint, { params: { records: ids } });
      await wait(pauseMs);
    }
  }

  return "reset";
};
