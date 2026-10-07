import { AirtableRecord } from "types";

export type SortDirection = "newest" | "oldest";

// the date shown in the tables - the "date" field or when Airtable created the record
const dateOf = (item: AirtableRecord<{ date?: string }>) =>
  Date.parse(item.fields.date || item.createdTime) || 0;

const sortByDate = <T extends AirtableRecord<{ date?: string }>>(
  data: T[],
  direction: SortDirection
): T[] =>
  [...data].sort((a, b) =>
    direction === "newest" ? dateOf(b) - dateOf(a) : dateOf(a) - dateOf(b)
  );

export default sortByDate;
