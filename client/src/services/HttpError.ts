// thrown by api for a non-2xx response; data = the parsed body (the server sends { error })
class HttpError extends Error {
  constructor(
    public status: number,
    public data?: unknown
  ) {
    super(`Request failed with status code ${status}`);
    this.name = "HttpError";
  }
}

export default HttpError;
