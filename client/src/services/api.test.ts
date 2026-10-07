import type { Mock } from "vitest";

import api from "./api";
import getErrorMessage from "./getErrorMessage";
import HttpError from "./HttpError";
import { getToken, removeToken, setToken, UNAUTHORIZED_EVENT } from "./authToken";

const mockedFetch = vi.fn() as Mock;

const jsonResponse = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });

// the error a request failed with
const rejectionOf = (promise: Promise<unknown>) =>
  promise.then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error: HttpError) => error
  );

const requestInit =(call = 0) => mockedFetch.mock.calls[call][1] as RequestInit;
const requestHeaders = (call = 0) =>
  requestInit(call).headers as Record<string, string>;

describe("api", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
    removeToken();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls the server under /api and returns the data", async () => {
    mockedFetch.mockResolvedValue(jsonResponse(200, [{ id: "1" }]));

    await expect(api.get("/subscribers")).resolves.toEqual([{ id: "1" }]);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/subscribers",
      expect.objectContaining({ method: "GET" })
    );
    expect(requestInit()).not.toHaveProperty("body");
  });

  it("sends the token from localStorage and the data as JSON", async () => {
    setToken("my-token");
    mockedFetch.mockResolvedValue(jsonResponse(200, {}));

    await api.post("/campaigns", { fields: {} });

    expect(requestInit().method).toBe("POST");
    expect(requestHeaders().Authorization).toBe("Bearer my-token");
    expect(requestInit().body).toBe(JSON.stringify({ fields: {} }));
  });

  it("does not send an Authorization header without a token", async () => {
    mockedFetch.mockResolvedValue(jsonResponse(200, {}));

    await api.get("/subscribers");

    expect(requestHeaders()).not.toHaveProperty("Authorization");
  });

  it("throws an HttpError with the status and the server error", async () => {
    mockedFetch.mockResolvedValue(jsonResponse(404, { error: "not found" }));

    const error = await rejectionOf(api.delete("/subscribers/1"));

    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ error: "not found" });
  });

  it("does not fail on a response that is not JSON", async () => {
    mockedFetch.mockResolvedValue(new Response("<html>Bad Gateway</html>", { status: 502 }));

    const error = await rejectionOf(api.get("/subscribers"));

    expect(error.status).toBe(502);
    expect(getErrorMessage(error)).toBe("Request failed with status code 502");
  });

  it("logs the user out on 401", async () => {
    setToken("expired");
    mockedFetch.mockResolvedValue(jsonResponse(401));
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    await expect(api.get("/subscribers")).rejects.toThrow();

    expect(getToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });

  it("does not log out on a failed login attempt", async () => {
    mockedFetch.mockResolvedValue(jsonResponse(401));
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    await expect(api.post("/auth/login", { password: "x" })).rejects.toThrow();

    expect(onUnauthorized).not.toHaveBeenCalled();
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });
});

describe("getErrorMessage", () => {
  it("prefers the error sent by the server", () => {
    expect(
      getErrorMessage(new HttpError(401, { error: "password is not correct" }))
    ).toBe("password is not correct");
  });

  it("falls back to the error message", () => {
    expect(getErrorMessage(new HttpError(500))).toBe(
      "Request failed with status code 500"
    );
    expect(getErrorMessage("boom")).toBe("boom");
  });
});
