import request from "supertest";

import { axiosInstance } from "../controllers/axiosInstance";
import { MAX_IMPORT_ROWS } from "../controllers/subscribersControllers";
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

const existing = [
  { id: "rec1", createdTime: "2022-01-01T00:00:00.000Z", fields: { name: "Anna", email: "anna@example.com" } },
  { id: "rec2", createdTime: "2022-01-02T00:00:00.000Z", fields: { name: "Bartek", email: "bartek@example.com" } },
];

const valid = (email: string, extra = {}) => ({
  name: "Ewa",
  surname: "Nowak",
  email,
  status: "active",
  profession: "tester",
  salary: "5000",
  telephone: "3432342344",
  ...extra,
});

let token: string;

beforeAll(() => {
  process.env.ADMIN_PASSWORD = "secret-password";
  process.env.AUTH_SECRET = "test-auth-secret";
  token = createToken();
});

beforeEach(() => {
  Object.values(airtable).forEach((mock) => mock.mockReset());
  airtable.get.mockResolvedValue({ data: { records: existing } });
  airtable.post.mockResolvedValue({ data: {} });
  airtable.patch.mockResolvedValue({ data: {} });
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("duplicate e-mails", () => {
  it("does not create a second subscriber with the same e-mail", async () => {
    const res = await request(app)
      .post("/api/subscribers")
      .set(auth())
      // other letter case and spaces - still the same address
      .send({ fields: valid(" Anna@Example.com ") });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("A subscriber with this e-mail already exists");
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("creates a subscriber with a new e-mail", async () => {
    const res = await request(app)
      .post("/api/subscribers")
      .set(auth())
      .send({ fields: valid("ewa@example.com") });

    expect(res.status).toBe(200);
    expect(airtable.post).toHaveBeenCalledTimes(1);
  });

  it("lets a subscriber keep their own e-mail when edited", async () => {
    const res = await request(app)
      .patch("/api/subscribers/rec1")
      .set(auth())
      .send({ fields: valid("anna@example.com") });

    expect(res.status).toBe(200);
    expect(airtable.patch).toHaveBeenCalledWith("/subscribers/rec1", {
      fields: valid("anna@example.com"),
    });
  });

  it("does not change the e-mail to the one of another subscriber", async () => {
    const res = await request(app)
      .patch("/api/subscribers/rec1")
      .set(auth())
      .send({ fields: valid("bartek@example.com") });

    expect(res.status).toBe(409);
    expect(airtable.patch).not.toHaveBeenCalled();
  });
});

describe("POST /api/subscribers/import", () => {
  const importRows = (subscribers: unknown, status?: string) =>
    request(app).post("/api/subscribers/import").set(auth()).send({ subscribers, status });

  it("needs a token", async () => {
    const res = await request(app)
      .post("/api/subscribers/import")
      .send({ subscribers: [valid("x@example.com")] });

    expect(res.status).toBe(401);
  });

  it("creates the valid rows and tells why the others were skipped", async () => {
    const res = await importRows([
      valid("ewa@example.com"),
      valid("ANNA@example.com"),
      valid("ewa@example.com", { name: "Second" }),
      valid("not-an-email"),
      valid("ola@example.com", { surname: "" }),
    ]);

    expect(res.status).toBe(200);
    expect(res.body.created).toBe(1);
    expect(res.body.skipped).toEqual([
      { row: 2, email: "ANNA@example.com", reason: "the e-mail already exists" },
      { row: 3, email: "ewa@example.com", reason: "the e-mail already exists" },
      { row: 4, email: "not-an-email", reason: "the e-mail is invalid" },
      { row: 5, email: "ola@example.com", reason: "name and surname are required" },
    ]);
    expect(airtable.post).toHaveBeenCalledWith("/subscribers", {
      records: [{ fields: valid("ewa@example.com", { status: "pending" }) }],
    });
  });

  it("sends only the known fields, trimmed", async () => {
    await importRows([valid(" ewa@example.com ", { isAdmin: true, name: " Ewa " })]);

    expect(airtable.post.mock.calls[0][1].records[0].fields).toEqual(
      valid("ewa@example.com", { status: "pending" })
    );
  });

  it("gives every row the status chosen for the import - not the row's own", async () => {
    await importRows(
      [valid("ewa@example.com", { status: "blocked" }), valid("ola@example.com", { status: "vip" })],
      "active"
    );

    const statuses = airtable.post.mock.calls[0][1].records.map(
      ({ fields }: { fields: { status: string } }) => fields.status
    );
    expect(statuses).toEqual(["active", "active"]);
  });

  it("needs only the name, the surname and the e-mail", async () => {
    const res = await importRows([{ name: "Ewa", surname: "Nowak", email: "ewa@example.com" }]);

    expect(res.body.created).toBe(1);
  });

  it.each(["blocked", "unsubscribed", "vip"])("refuses to import as %s", async (status) => {
    const res = await importRows([valid("ewa@example.com")], status);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Imported subscribers can only be pending or active");
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("creates the records in batches of 10 (the Airtable limit)", async () => {
    const rows = Array.from({ length: 12 }, (_, i) => valid(`user${i}@example.com`));

    const res = await importRows(rows);

    expect(res.body.created).toBe(12);
    expect(airtable.post).toHaveBeenCalledTimes(2);
    expect(airtable.post.mock.calls[0][1].records).toHaveLength(10);
    expect(airtable.post.mock.calls[1][1].records).toHaveLength(2);
  });

  it.each([
    ["nothing", [], "There is nothing to import"],
    ["not a list", "abc", "There is nothing to import"],
    [
      "too many rows",
      Array.from({ length: MAX_IMPORT_ROWS + 1 }, (_, i) => valid(`u${i}@example.com`)),
      `At most ${MAX_IMPORT_ROWS} subscribers can be imported at once`,
    ],
  ])("rejects %s", async (_, rows, message) => {
    const res = await importRows(rows);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(message);
    expect(airtable.post).not.toHaveBeenCalled();
  });
});
