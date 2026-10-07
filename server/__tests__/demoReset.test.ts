import request from "supertest";

import { resetDemoData } from "../demo/resetDemoData";
import { setResetRunning } from "../controllers/demoControllers";
import { app } from "../app";

jest.mock("../demo/resetDemoData", () => ({ resetDemoData: jest.fn() }));

const mockedReset = resetDemoData as jest.Mock;

const callReset = (key?: string, body?: object) => {
  const call = request(app).post("/api/demo/reset");

  if (key) call.set("Authorization", `Bearer ${key}`);

  return call.send(body);
};

describe("POST /api/demo/reset", () => {
  beforeEach(() => {
    mockedReset.mockReset();
    setResetRunning(false);
    process.env.DEMO_RESET_KEY = "reset-key";
  });

  afterAll(() => {
    delete process.env.DEMO_RESET_KEY;
  });

  it("does not exist on a server without DEMO_RESET_KEY", async () => {
    delete process.env.DEMO_RESET_KEY;

    const response = await callReset("anything");

    expect(response.status).toBe(404);
    expect(mockedReset).not.toHaveBeenCalled();
  });

  it.each([
    ["without a key", undefined],
    ["with a wrong key", "wrong-key"],
  ])("rejects a call %s", async (_, key) => {
    const response = await callReset(key);

    expect(response.status).toBe(401);
    expect(mockedReset).not.toHaveBeenCalled();
  });

  it("does not accept the login token instead of the key", async () => {
    process.env.ADMIN_PASSWORD = "secret-password";
    process.env.AUTH_SECRET = "test-auth-secret";
    const { createToken } = await import("../helpers/authToken");

    const response = await callReset(createToken());

    expect(response.status).toBe(401);
  });

  it("resets the data and tells what happened", async () => {
    mockedReset.mockResolvedValue("skipped");

    const response = await callReset("reset-key");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", result: "skipped" });
    expect(mockedReset).toHaveBeenCalledWith({ force: false });
  });

  it("passes force from the body", async () => {
    mockedReset.mockResolvedValue("reset");

    await callReset("reset-key", { force: true });

    expect(mockedReset).toHaveBeenCalledWith({ force: true });
  });

  it("refuses a second reset while one is running", async () => {
    setResetRunning(true);

    const response = await callReset("reset-key");

    expect(response.status).toBe(409);
    expect(mockedReset).not.toHaveBeenCalled();
  });

  it("answers 500 with a safe message when Airtable fails", async () => {
    mockedReset.mockRejectedValue(new Error("Airtable is down"));

    const response = await callReset("reset-key");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ status: "fail", error: "Airtable is down" });

    // the lock is released after a failure
    mockedReset.mockResolvedValue("reset");
    expect((await callReset("reset-key")).status).toBe(200);
  });
});
