import { AxiosError } from "axios";

// returns only safe error details - never the axios config (it holds the Airtable token)
export const getErrorMessage = (error: unknown): unknown => {
  const { response, message } = error as AxiosError<{
    error?: { message?: string } | string;
  }>;
  const airtableError = response?.data?.error;

  if (typeof airtableError === "object" && airtableError?.message) {
    return airtableError.message;
  }

  return airtableError || message;
};
