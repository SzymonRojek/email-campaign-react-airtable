import { AxiosError } from "axios";

// readable message from the server response ({ error }) or the axios error
const getErrorMessage = (error: unknown): string => {
  const serverError = (error as AxiosError<{ error?: unknown }>).response?.data
    ?.error;

  if (typeof serverError === "string") return serverError;

  return error instanceof Error ? error.message : String(error);
};

export default getErrorMessage;
