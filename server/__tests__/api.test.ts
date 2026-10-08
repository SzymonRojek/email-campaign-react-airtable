import request from "supertest";

import { axiosInstance } from "../controllers/axiosInstance";
import { resetFailedAttempts } from "../controllers/authControllers";
import { createToken } from "../helpers/authToken";
import { app } from "../app";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const airtable = axiosInstance as unknown as Record<
  "get" | "post" | "patch" | "delete",
  jest.Mock
>;

// an axios error the way Airtable fails - with the token in the request config
const airtableError = (status: number, error: unknown) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    config: { headers: { Authorization: "Bearer patSECRET" } },
    response: { status, data: { error } },
  });

const subscriber = (id: string, name: string) => ({
  id,
  createdTime: "2022-09-05T16:34:10.000Z",
  fields: { name, surname: "Kowalski", status: "active" },
});

let token: string;

beforeAll(() => {
  process.env.ADMIN_PASSWORD = "secret-password";
  process.env.AUTH_SECRET = "test-auth-secret";
  token = createToken();
});

beforeEach(() => {
  Object.values(airtable).forEach((mock) => mock.mockReset());
  resetFailedAttempts();
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("POST /api/auth/login", () => {
  it("returns a token for the correct password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "secret-password" });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("password is not correct");
  });

  it("accepts the password with spaces around it (a phone keyboard adds them)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "  secret-password " });

    expect(res.status).toBe(200);
  });

  it("does not accept another letter case", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "Secret-password" });

    expect(res.status).toBe(401);
  });

  it("blocks only the visitor who made the mistakes - by Cloudflare's address header", async () => {
    const login = (ip: string, password: string) =>
      request(app).post("/api/auth/login").set("CF-Connecting-IP", ip).send({ password });

    for (let i = 0; i < 5; i++) await login("203.0.113.1", "wrong");

    expect((await login("203.0.113.1", "secret-password")).status).toBe(429);
    // another visitor behind the same Cloudflare server still gets in
    expect((await login("203.0.113.2", "secret-password")).status).toBe(200);
  });

  it("blocks the ip after 5 failed attempts", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/login").send({ password: "wrong" });
    }

    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "secret-password" });

    expect(res.status).toBe(429);
  });

  it("fails when login is not configured", async () => {
    const { AUTH_SECRET } = process.env;
    delete process.env.AUTH_SECRET;

    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "secret-password" });

    process.env.AUTH_SECRET = AUTH_SECRET;

    expect(res.status).toBe(500);
  });
});

describe("GET /api/health", () => {
  it("answers without a token", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("does not say which server it is, nor let other websites call it", async () => {
    const res = await request(app).get("/api/health").set("Origin", "https://other-site.example");

    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("protected endpoints", () => {
  it.each(["/api/subscribers", "/api/campaigns", "/api/campaigns/rec1"])(
    "%s requires a token",
    async (url) => {
      const res = await request(app).get(url);

      expect(res.status).toBe(401);
      expect(airtable.get).not.toHaveBeenCalled();
    }
  );

  it("rejects an invalid token", async () => {
    const res = await request(app)
      .get("/api/subscribers")
      .set({ Authorization: "Bearer abc.def" });

    expect(res.status).toBe(401);
  });

  it("returns json 404 for an unknown api endpoint", async () => {
    const res = await request(app).get("/api/nope");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Endpoint does not exist");
  });
});

describe("/api/subscribers", () => {
  it("returns all subscribers sorted by name", async () => {
    airtable.get.mockResolvedValue({
      data: { records: [subscriber("1", "zoe"), subscriber("2", "Adam")] },
    });

    const res = await request(app).get("/api/subscribers").set(auth());

    expect(res.status).toBe(200);
    expect(res.body.map((item: { id: string }) => item.id)).toEqual(["2", "1"]);
  });

  it("creates a subscriber only with the known fields", async () => {
    airtable.post.mockResolvedValue({ data: subscriber("3", "Ewa") });

    const res = await request(app)
      .post("/api/subscribers")
      .set(auth())
      .send({ fields: { name: "Ewa", status: "active", isAdmin: true } });

    expect(res.status).toBe(200);
    expect(airtable.post.mock.calls[0][1].fields).not.toHaveProperty("isAdmin");
  });

  it("returns 404 for a missing subscriber", async () => {
    airtable.get.mockRejectedValue(airtableError(404, "NOT_FOUND"));

    const res = await request(app).get("/api/subscribers/recX").set(auth());

    expect(res.status).toBe(404);
  });

  it("deletes a subscriber", async () => {
    airtable.delete.mockResolvedValue({ data: { id: "1", deleted: true } });

    const res = await request(app).delete("/api/subscribers/1").set(auth());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "1", deleted: true });
  });

  it("answers 404 instead of crashing when Airtable fails on delete", async () => {
    airtable.delete.mockRejectedValue(airtableError(404, "NOT_FOUND"));

    const res = await request(app).delete("/api/subscribers/recX").set(auth());

    expect(res.status).toBe(404);
  });
});

describe("/api/campaigns", () => {
  it("capitalizes the title and description of a new campaign", async () => {
    airtable.post.mockResolvedValue({ data: { id: "1" } });

    await request(app)
      .post("/api/campaigns")
      .set(auth())
      .send({
        fields: { title: "black Friday", description: "sale", status: "draft" },
      });

    expect(airtable.post.mock.calls[0][1].fields).toEqual({
      title: "Black Friday",
      description: "Sale",
      status: "draft",
    });
  });

  it("updates a campaign", async () => {
    airtable.patch.mockResolvedValue({ data: { id: "1" } });

    const body = { fields: { status: "sent" } };
    const res = await request(app)
      .patch("/api/campaigns/1")
      .set(auth())
      .send(body);

    expect(res.status).toBe(200);
    expect(airtable.patch).toHaveBeenCalledWith("/campaigns/1", body);
  });
});

describe("error responses", () => {
  it("never leak the Airtable token", async () => {
    airtable.get.mockRejectedValue(airtableError(401, "AUTHENTICATION_REQUIRED"));
    airtable.post.mockRejectedValue(
      airtableError(422, { message: "Unknown field" })
    );

    const list = await request(app).get("/api/campaigns").set(auth());
    const create = await request(app)
      .post("/api/subscribers")
      .set(auth())
      .send({ fields: {} });

    expect(list.status).toBe(404);
    expect(create.status).toBe(400);
    expect(create.body.error).toBe("Unknown field");
    expect(list.text + create.text).not.toContain("patSECRET");
  });
});
