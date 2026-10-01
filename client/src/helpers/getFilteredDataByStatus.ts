import { AirtableRecord } from "types";

const getFilteredDataByStatus = <T extends AirtableRecord<{ status: string }>>(
  data: T[] | undefined,
  status: string
): T[] => {
  if (!data) return [];

  return data.filter((item) => item.fields.status === status);
};

export default getFilteredDataByStatus;
