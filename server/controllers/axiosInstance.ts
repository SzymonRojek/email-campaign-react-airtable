import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  REACT_APP_DB_ID,
  REACT_APP_API_KEY,
  // only for tests - points the server at a fake Airtable
  AIRTABLE_API_URL = "https://api.airtable.com/v0",
} = process.env;

export const axiosInstance = axios.create({
  baseURL: `${AIRTABLE_API_URL}/${REACT_APP_DB_ID}`,
  headers: {
    Authorization: `Bearer ${REACT_APP_API_KEY}`,
    "Content-Type": "application/json",
  },
});
