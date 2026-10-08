import { axiosInstance } from "../controllers/axiosInstance";
import { AirtableListResponse, AirtableRecord } from "../types";

// Airtable returns max 100 records per request - follow the offset to get all of them;
// params: e.g. { filterByFormula } to get only some records
export const getAllRecords = async (
  endpoint: string,
  params: Record<string, string> = {}
) => {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const { data } = await axiosInstance.get<AirtableListResponse>(endpoint, {
      params: { ...params, offset },
    });

    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
};
