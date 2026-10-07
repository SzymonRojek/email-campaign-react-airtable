import HttpError from "./HttpError";

// readable message from the server response ({ error }) or the error itself
const getErrorMessage = (error: unknown): string => {
  const serverError =
    error instanceof HttpError
      ? (error.data as { error?: unknown } | undefined)?.error
      : undefined;

  if (typeof serverError === "string") return serverError;

  return error instanceof Error ? error.message : String(error);
};

export default getErrorMessage;
