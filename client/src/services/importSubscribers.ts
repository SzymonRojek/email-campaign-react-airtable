import api from "./api";
import { SubscriberFormValues } from "types";

export interface ImportResult {
  created: number;
  // rows the server did not add, e.g. an e-mail added in the meantime
  skipped: { row: number; email: string; reason: string }[];
}

const importSubscribers = (subscribers: SubscriberFormValues[]) =>
  api.post<ImportResult>("/subscribers/import", { subscribers });

export default importSubscribers;
