import { AirtableRecord } from "../types";

type Record = AirtableRecord<{ name?: unknown; title?: unknown }>;

export const sortDataAlphabetically = <T extends Record>(data: T[]): T[] => {
  const copyData = [...data];

  const isName =
    copyData.map((item) => item.fields?.name).filter(Boolean).length > 0;

  const nestedPropertyRetriever = (obj: T) =>
    String(
      (isName ? obj?.fields?.name : obj?.fields?.title) ?? ""
    ).toLowerCase();

  return copyData.sort((a, b) => {
    const valueA = nestedPropertyRetriever(a);
    const valueB = nestedPropertyRetriever(b);

    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });
};
