import { axiosInstance } from "../controllers/axiosInstance";
import { AirtableListResponse, AirtableRecord } from "../types";

// Airtable returns max 100 records per request - follow the offset to get all of them
export const getAllRecords = async (endpoint: string) => {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const { data } = await axiosInstance.get<AirtableListResponse>(endpoint, {
      params: { offset },
    });

    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
};
