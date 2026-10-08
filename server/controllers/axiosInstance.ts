import axios from "axios";
import dotenv from "dotenv";

import { airtableConfig } from "../helpers/airtableConfig";

dotenv.config();

const { apiUrl, baseId, token, missing } = airtableConfig();

// the server starts anyway (e.g. the health check), but no data can be loaded
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")} - see .env.example`);
}

export const axiosInstance = axios.create({
  baseURL: `${apiUrl}/${baseId}`,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
