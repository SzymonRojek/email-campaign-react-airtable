import axios from "axios";
import dotenv from "dotenv";

import { airtableConfig } from "../helpers/airtableConfig";

dotenv.config();

const { apiUrl, baseId, token, oldNames } = airtableConfig();

if (oldNames.length) {
  console.warn(`Old environment variable names - please rename: ${oldNames.join(", ")}`);
}

export const axiosInstance = axios.create({
  baseURL: `${apiUrl}/${baseId}`,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
