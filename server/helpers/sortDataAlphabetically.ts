import { AirtableRecord } from "../types";

type Record = AirtableRecord<{ name?: unknown; subject?: unknown }>;

export const sortDataAlphabetically = <T extends Record>(data: T[]): T[] => {
  const copyData = [...data];

  const isName =
    copyData.map((item) => item.fields?.name).filter(Boolean).length > 0;

  const nestedPropertyRetriever = (obj: T) =>
    String(
      (isName ? obj?.fields?.name : obj?.fields?.subject) ?? ""
    ).toLowerCase();

  // localeCompare - Polish letters (Ł, Ś...) next to their base letters, not after "z"
  return copyData.sort((a, b) =>
    nestedPropertyRetriever(a).localeCompare(nestedPropertyRetriever(b), "pl")
  );
};
