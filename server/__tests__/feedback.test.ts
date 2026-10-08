import request from "supertest";

import { axiosInstance } from "../controllers/axiosInstance";
import { resetFeedbackState } from "../controllers/feedbackControllers";
import { app } from "../app";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const airtable = axiosInstance as unknown as Record<"get" | "post", jest.Mock>;

const entry = (id: string, fields: object, date: string) => ({
  id,
  createdTime: date,
  fields: { name: "Anna", role: "Recruiter", message: "Great project", date, ...fields },
});

const records = [
  entry("recOld", { approved: true, isPublic: true, name: "Old" }, "2026-10-01T10:00:00.000Z"),
  entry("recNew", { approved: true, isPublic: true, name: "New" }, "2026-10-05T10:00:00.000Z"),
  entry("recPrivate", { approved: true, isPublic: false }, "2026-10-06T10:00:00.000Z"),
  entry("recWaiting", { approved: false, isPublic: true }, "2026-10-07T10:00:00.000Z"),
];

const valid = { name: "Anna", role: "Recruiter", message: "Clean code and great tests", isPublic: true };
const send = (body: object) => request(app).post("/api/feedback").send(body);

beforeEach(() => {
  resetFeedbackState();
  airtable.get.mockReset().mockResolvedValue({ data: { records } });
  airtable.post.mockReset().mockResolvedValue({ data: {} });
});

afterEach(() => jest.restoreAllMocks());

describe("GET /api/feedback", () => {
  it("shows only the approved public feedback, newest first - without a login", async () => {
    const res = await request(app).get("/api/feedback");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "recNew", name: "New", role: "Recruiter", message: "Great project", date: "2026-10-05T10:00:00.000Z" },
      { id: "recOld", name: "Old", role: "Recruiter", message: "Great project", date: "2026-10-01T10:00:00.000Z" },
    ]);
    expect(airtable.get).toHaveBeenCalledWith("/feedback", {
      params: { filterByFormula: "AND({approved}, {isPublic})", offset: undefined },
    });
  });

  it("asks Airtable at most once in 30 seconds", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);

    await request(app).get("/api/feedback");
    now.mockReturnValue(1_000_000 + 29 * 1000);
    await request(app).get("/api/feedback");
    expect(airtable.get).toHaveBeenCalledTimes(1);

    now.mockReturnValue(1_000_000 + 31 * 1000);
    await request(app).get("/api/feedback");
    expect(airtable.get).toHaveBeenCalledTimes(2);
  });

  it("keeps showing the last feedback when Airtable is down", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    await request(app).get("/api/feedback");

    now.mockReturnValue(1_000_000 + 31 * 1000);
    airtable.get.mockRejectedValue(new Error("Airtable is down"));
    const res = await request(app).get("/api/feedback");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("POST /api/feedback", () => {
  it("saves the feedback for a review - never approved by itself", async () => {
    const res = await send({ ...valid, name: "  Anna  ", approved: true });

    expect(res.status).toBe(201);
    expect(airtable.post).toHaveBeenCalledWith("/feedback", {
      fields: {
        name: "Anna",
        role: "Recruiter",
        message: "Clean code and great tests",
        isPublic: true,
        approved: false,
        date: expect.any(String),
      },
    });
  });

  it("keeps the feedback private unless its author lets show it", async () => {
    await send({ ...valid, isPublic: "yes" });

    expect(airtable.post.mock.calls[0][1].fields.isPublic).toBe(false);
  });

  it.each([
    [{ name: "" }, "name is required"],
    [{ name: "x".repeat(41) }, "name must not exceed 40 characters"],
    [{ role: "x".repeat(41) }, "role must not exceed 40 characters"],
    [{ message: "hi" }, "the feedback must be at least 3 characters"],
    [{ message: "x".repeat(501) }, "the feedback must not exceed 500 characters"],
    [{ name: { $ne: "" } }, "name is required"],
  ])("refuses %j", async (change, error) => {
    const res = await send({ ...valid, ...change });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(error);
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("pretends to save what a bot sent, but saves nothing", async () => {
    const res = await send({ ...valid, website: "https://spam.example" });

    expect(res.status).toBe(201);
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("takes 3 entries an hour from one address", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);

    for (let i = 0; i < 3; i++) expect((await send(valid)).status).toBe(201);
    const fourth = await send(valid);
    expect(fourth.status).toBe(429);
    expect(airtable.post).toHaveBeenCalledTimes(3);

    now.mockReturnValue(1_000_000 + 61 * 60 * 1000);
    expect((await send(valid)).status).toBe(201);
  });
});
