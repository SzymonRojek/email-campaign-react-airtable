import type { Mock } from "vitest";
import axios from "axios";

import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { getToken, removeToken, setToken, UNAUTHORIZED_EVENT } from "./authToken";

vi.mock("axios", () => ({ default: vi.fn() }));

const mockedAxios = axios as unknown as Mock;

const httpError = (status: number, error?: string) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, data: { error } },
  });

describe("api", () => {
  beforeEach(() => {
    mockedAxios.mockReset();
    removeToken();
  });

  it("calls the server under /api and returns the data", async () => {
    mockedAxios.mockResolvedValue({ data: [{ id: "1" }] });

    await expect(api.get("/subscribers")).resolves.toEqual([{ id: "1" }]);
    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "get",
        baseURL: "/api",
        url: "/subscribers",
      })
    );
  });

  it("sends the token from localStorage", async () => {
    setToken("my-token");
    mockedAxios.mockResolvedValue({ data: {} });

    await api.post("/campaigns", { fields: {} });

    expect(mockedAxios.mock.calls[0][0].headers.Authorization).toBe(
      "Bearer my-token"
    );
    expect(mockedAxios.mock.calls[0][0].data).toEqual({ fields: {} });
  });

  it("does not send an Authorization header without a token", async () => {
    mockedAxios.mockResolvedValue({ data: {} });

    await api.get("/subscribers");

    expect(mockedAxios.mock.calls[0][0].headers).not.toHaveProperty(
      "Authorization"
    );
  });

  it("logs the user out on 401", async () => {
    setToken("expired");
    mockedAxios.mockRejectedValue(httpError(401));
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    await expect(api.get("/subscribers")).rejects.toThrow();

    expect(getToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });

  it("does not log out on a failed login attempt", async () => {
    mockedAxios.mockRejectedValue(httpError(401));
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    await expect(api.post("/auth/login", { password: "x" })).rejects.toThrow();

    expect(onUnauthorized).not.toHaveBeenCalled();
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });
});

describe("getErrorMessage", () => {
  it("prefers the error sent by the server", () => {
    expect(getErrorMessage(httpError(401, "password is not correct"))).toBe(
      "password is not correct"
    );
  });

  it("falls back to the error message", () => {
    expect(getErrorMessage(httpError(500))).toBe(
      "Request failed with status code 500"
    );
    expect(getErrorMessage("boom")).toBe("boom");
  });
});
