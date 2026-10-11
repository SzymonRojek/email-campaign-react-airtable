import request from "supertest";

import { axiosInstance } from "../controllers/axiosInstance";
import { createToken } from "../helpers/authToken";
import { buildEmail, unknownPlaceholders } from "../mail/buildEmail";
import { createOptOutToken, readOptOutToken } from "../mail/optOutToken";
import { app } from "../app";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const airtable = axiosInstance as unknown as Record<
  "get" | "post" | "patch" | "delete",
  jest.Mock
>;

const candidate = (id: string, name: string, status = "open to offers") => ({
  id,
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: { name, surname: "Nowak", email: `${name.toLowerCase()}@example.com`, status },
});

const candidates = [
  candidate("recAnna", "Anna"),
  candidate("recBartek", "Bartek"),
  candidate("recCelina", "Celina", "awaiting consent"),
  candidate("recDarek", "Darek", "opted out"),
];

const draft = {
  id: "recJobOffer1",
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: { subject: "Autumn sale", message: "Big <b>discounts</b>\nthis week", status: "draft" },
};

// Airtable answers by the address of the request
const airtableData = (data: Record<string, unknown>) =>
  airtable.get.mockImplementation((endpoint: string) => {
    const path = Object.keys(data).find((key) => endpoint === key);
    return path ? Promise.resolve({ data: data[path] }) : Promise.reject(new Error("404"));
  });

let token: string;

beforeAll(() => {
  process.env.ADMIN_PASSWORD = "secret-password";
  process.env.AUTH_SECRET = "test-auth-secret";
  token = createToken();
});

beforeEach(() => {
  Object.values(airtable).forEach((mock) => mock.mockReset());
  airtable.post.mockResolvedValue({ data: { records: [] } });
  airtable.patch.mockImplementation((path: string, body: object) =>
    Promise.resolve({ data: { id: path.split("/").pop(), ...body } })
  );
  airtable.delete.mockResolvedValue({ data: {} });
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("buildEmail", () => {
  const email = buildEmail({
    jobOffer: { subject: "Autumn <sale>", message: "Line 1\n<script>x</script>" },
    recipient: { name: "Anna", email: "anna@example.com" },
    optOutUrl: "https://app.example.com/#/opt-out/abc.def",
  });

  it("is addressed and greets the candidate by name", () => {
    expect(email.to).toBe("anna@example.com");
    expect(email.subject).toBe("Autumn <sale>");
    expect(email.html).toContain("Hello Anna,");
    expect(email.text).toContain("Hello Anna,");
  });

  it("does not let the job offer text become HTML", () => {
    expect(email.html).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("Autumn &lt;sale&gt;");
    expect(email.html).toContain("Line 1<br>");
  });

  it("has the opt-out link", () => {
    expect(email.html).toContain('href="https://app.example.com/#/opt-out/abc.def"');
    expect(email.text).toContain("Opt out: https://app.example.com/#/opt-out/abc.def");
  });

  it("is a plain message - no banner, no repeated subject", () => {
    expect(email.html).not.toContain("Talent Outreach");
    expect(email.html).not.toContain("<h1");
    expect(email.from).toEqual({ name: "Talent Outreach", address: "offers@example.com" });
  });
});

describe("templates", () => {
  const build = (subject: string, message: string, recipient = { name: "Emma", surname: "Johnson" }) =>
    buildEmail({ jobOffer: { subject, message }, recipient, optOutUrl: "https://app/#/u/x" });

  it("fills in {{name}} and {{surname}} for every recipient", () => {
    const email = build("{{name}}, your discount", "Dear {{ name }} {{surname}}, welcome!");

    expect(email.subject).toBe("Emma, your discount");
    expect(email.html).toContain("Dear Emma Johnson, welcome!");
    expect(email.text).toContain("Dear Emma Johnson, welcome!");
  });

  it("fills in {{role}} with the candidate's role - empty when there is none", () => {
    const withRole = buildEmail({
      jobOffer: { subject: "An offer for a {{role}}", message: "Your experience as a {{ role }}" },
      recipient: { name: "Emma", role: "Frontend Developer" },
      optOutUrl: "https://app/#/u/x",
    });
    const withoutRole = build("Hi", "as a {{role}}.");

    expect(withRole.subject).toBe("An offer for a Frontend Developer");
    expect(withRole.html).toContain("Your experience as a Frontend Developer");
    expect(withoutRole.text).toContain("as a .");
  });

  it("never lets a name become HTML or a link", () => {
    const email = build("Hi", "Dear {{name}}", { name: "<img src=x> https://evil.example", surname: "" });

    expect(email.html).toContain("Dear &lt;img src=x&gt; https://evil.example");
    expect(email.html).not.toContain("<img");
    expect(email.html).not.toContain("evil.example\"");
  });

  it("keeps the text as written: paragraphs, line breaks, links", () => {
    const email = build("Hi", "First line\nsecond line\n\n**Big** *news* at https://example.com/sale?a=1&b=2.");

    expect(email.html).toContain('<p style="margin:0 0 16px">First line<br>second line</p>');
    expect(email.html).toContain("**Big** *news* at");
    expect(email.html).not.toContain("<strong>");
    expect(email.html).toContain(
      '<a href="https://example.com/sale?a=1&amp;b=2" style="color:#1a73e8">https://example.com/sale?a=1&amp;b=2</a>.'
    );
    expect(email.text).toContain("**Big** *news* at https://example.com/sale?a=1&b=2.");
  });

  it("finds unknown placeholders", () => {
    expect(unknownPlaceholders("{{nmae}} and {{name}}", "{{email}} {{nmae}}")).toEqual(["nmae", "email"]);
    expect(unknownPlaceholders("{{name}} {{ surname }}", undefined)).toEqual([]);
  });
});

describe("opt-out token", () => {
  it("reads back the candidate id", () => {
    expect(readOptOutToken(createOptOutToken("recAnna"))).toBe("recAnna");
  });

  it.each([
    ["another candidate's id", () => `recBartek.${createOptOutToken("recAnna").split(".")[1]}`],
    ["a changed signature", () => `${createOptOutToken("recAnna")}x`],
    ["no signature", () => "recAnna"],
    ["a login token", () => createToken()],
  ])("refuses %s", (_, makeToken) => {
    expect(readOptOutToken(makeToken())).toBeNull();
  });

  it("stops working with another server secret", () => {
    const old = createOptOutToken("recAnna");
    process.env.AUTH_SECRET = "another-secret";

    expect(readOptOutToken(old)).toBeNull();
    process.env.AUTH_SECRET = "test-auth-secret";
  });
});

describe("POST /api/job-offers/:id/send", () => {
  const send = (body: object = {}) =>
    request(app).post("/api/job-offers/recJobOffer1/send").set(auth()).send(body);

  beforeEach(() =>
    airtableData({
      "/jobOffers/recJobOffer1": draft,
      "/candidates": { records: candidates },
    })
  );

  it("needs the login token", async () => {
    expect((await request(app).post("/api/job-offers/recJobOffer1/send")).status).toBe(401);
  });

  it("saves an e-mail for every active candidate, then marks the job offer sent", async () => {
    const res = await send();

    expect(res.status).toBe(200);
    expect(res.body.sent).toBe(2);
    expect(airtable.post).toHaveBeenCalledWith("/outbox", {
      records: [
        expect.objectContaining({
          fields: expect.objectContaining({ email: "anna@example.com", name: "Anna Nowak", candidateId: "recAnna", jobOfferId: "recJobOffer1" }),
        }),
        expect.objectContaining({
          fields: expect.objectContaining({ email: "bartek@example.com", candidateId: "recBartek" }),
        }),
      ],
    });
    expect(airtable.patch).toHaveBeenCalledWith("/jobOffers/recJobOffer1", {
      fields: { status: "sent", date: res.body.sentAt },
    });
    expect(airtable.post.mock.invocationCallOrder[0]).toBeLessThan(
      airtable.patch.mock.invocationCallOrder[0]
    );
  });

  it("sends only to the chosen candidates - and never to inactive ones", async () => {
    const res = await send({ recipientIds: ["recBartek", "recCelina", "recDarek"] });

    expect(res.body.sent).toBe(1);
    expect(airtable.post.mock.calls[0][1].records).toHaveLength(1);
    expect(airtable.post.mock.calls[0][1].records[0].fields.candidateId).toBe("recBartek");
  });

  it("refuses when nobody can get it", async () => {
    const res = await send({ recipientIds: ["recCelina"] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("There are no active recipients");
    expect(airtable.post).not.toHaveBeenCalled();
    expect(airtable.patch).not.toHaveBeenCalled();
  });

  it("does not send a job offer twice", async () => {
    airtableData({
      "/jobOffers/recJobOffer1": { ...draft, fields: { ...draft.fields, status: "sent" } },
      "/candidates": { records: candidates },
    });

    const res = await send();

    expect(res.status).toBe(409);
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("refuses a job offer with an unknown placeholder", async () => {
    airtableData({
      "/jobOffers/recJobOffer1": { ...draft, fields: { ...draft.fields, message: "Hi {{nmae}}" } },
      "/candidates": { records: candidates },
    });

    const res = await send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Unknown placeholder: {{nmae}} - use {{name}}, {{surname}} or {{role}}");
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("saves the e-mails in batches of 10", async () => {
    airtableData({
      "/jobOffers/recJobOffer1": draft,
      "/candidates": {
        records: Array.from({ length: 12 }, (_, i) => candidate(`recS${i}`, `Person${i}`)),
      },
    });

    await send();

    expect(airtable.post).toHaveBeenCalledTimes(2);
    expect(airtable.post.mock.calls[1][1].records).toHaveLength(2);
  });
});

describe("the outbox of a job offer", () => {
  const emailRow = (id: string, name: string, jobOfferId = "recJobOffer1") => ({
    id,
    createdTime: "2026-01-01T00:00:00.000Z",
    fields: { email: `${name.toLowerCase()}@example.com`, name: `${name} Nowak`, candidateId: `rec${name}`, jobOfferId, sentAt: "2026-10-01T10:00:00.000Z" },
  });

  it("lists who got the job offer, by name", async () => {
    airtableData({
      "/outbox": {
        records: [emailRow("recE2", "Bartek"), emailRow("recE1", "Anna"), emailRow("recE3", "Other", "recOther")],
      },
    });

    const res = await request(app).get("/api/job-offers/recJobOffer1/outbox").set(auth());

    expect(res.body.map(({ id }: { id: string }) => id)).toEqual(["recE1", "recE2"]);
    expect(airtable.get).toHaveBeenCalledWith("/outbox", {
      params: { filterByFormula: "{jobOfferId}='recJobOffer1'", offset: undefined },
    });
  });

  it("does not put anything else than a record id into the formula", async () => {
    const res = await request(app)
      .get(`/api/job-offers/${encodeURIComponent("x' OR 1=1")}/outbox`)
      .set(auth());

    expect(res.body).toEqual([]);
    expect(airtable.get).not.toHaveBeenCalled();
  });

  it("shows an e-mail as its recipient got it", async () => {
    airtableData({
      "/outbox/recE1": emailRow("recE1", "Anna"),
      "/jobOffers/recJobOffer1": { ...draft, fields: { ...draft.fields, status: "sent" } },
    });

    const res = await request(app).get("/api/outbox/recE1/preview").set(auth());

    expect(res.status).toBe(200);
    expect(res.body.to).toBe("anna@example.com");
    expect(res.body.subject).toBe("Autumn sale");
    expect(res.body.html).toContain("Hello Anna,");
    expect(res.body.toName).toBe("Anna Nowak");
    expect(res.body.html).toMatch(/#\/opt-out\/recAnna\.[\w-]+/);
    expect(res.body.sentAt).toBe("2026-10-01T10:00:00.000Z");
  });

  it("fills in {{role}} of a sent e-mail with the candidate's current role", async () => {
    const offer = { ...draft, fields: { ...draft.fields, message: "As a {{role}}", status: "sent" } };
    const anna = candidate("recAnna", "Anna");

    airtableData({
      "/outbox/recE1": emailRow("recE1", "Anna"),
      "/jobOffers/recJobOffer1": offer,
      "/candidates/recAnna": { ...anna, fields: { ...anna.fields, role: "QA Engineer" } },
    });
    expect((await request(app).get("/api/outbox/recE1/preview").set(auth())).body.html).toContain(
      "As a QA Engineer"
    );

    // the candidate has been deleted - the e-mail still opens, without the role
    airtableData({ "/outbox/recE1": emailRow("recE1", "Anna"), "/jobOffers/recJobOffer1": offer });
    const res = await request(app).get("/api/outbox/recE1/preview").set(auth());
    expect(res.status).toBe(200);
    expect(res.body.html).toContain("As a ");
  });

  it("lists the job offers a candidate got, newest first", async () => {
    const older = emailRow("recE1", "Anna");
    const newer = { ...emailRow("recE2", "Anna", "recJobOffer2"), fields: { ...emailRow("recE2", "Anna", "recJobOffer2").fields, sentAt: "2026-10-05T10:00:00.000Z" } };
    airtableData({
      "/outbox": { records: [older, newer, emailRow("recE3", "Bartek")] },
      "/jobOffers": {
        records: [
          { ...draft, fields: { ...draft.fields, status: "sent" } },
          { ...draft, id: "recJobOffer2", fields: { ...draft.fields, subject: "Winter", status: "sent" } },
        ],
      },
    });

    const res = await request(app).get("/api/candidates/recAnna/outbox").set(auth());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "recE2", jobOfferId: "recJobOffer2", subject: "Winter", sentAt: "2026-10-05T10:00:00.000Z" },
      { id: "recE1", jobOfferId: "recJobOffer1", subject: "Autumn sale", sentAt: "2026-10-01T10:00:00.000Z" },
    ]);
    expect(airtable.get).toHaveBeenCalledWith("/outbox", {
      params: { filterByFormula: "{candidateId}='recAnna'", offset: undefined },
    });
  });

  it("lists every sent e-mail with its job offer, newest first", async () => {
    const newer = emailRow("recE2", "Bartek", "recJobOffer2");
    newer.fields.sentAt = "2026-10-05T10:00:00.000Z";
    airtableData({
      "/outbox": { records: [emailRow("recE1", "Anna"), newer, emailRow("recE3", "Gone", "recDeleted")] },
      "/jobOffers": {
        records: [draft, { ...draft, id: "recJobOffer2", fields: { ...draft.fields, subject: "Winter" } }],
      },
    });

    const res = await request(app).get("/api/outbox").set(auth());

    expect(res.status).toBe(200);
    expect(res.body.map(({ id, subject }: { id: string; subject: string }) => [id, subject])).toEqual([
      ["recE2", "Winter"],
      ["recE1", "Autumn sale"],
    ]);
    expect(res.body[1]).toEqual(
      expect.objectContaining({
        name: "Anna Nowak",
        email: "anna@example.com",
        jobOfferId: "recJobOffer1",
        // the client counts "last contacted" of every candidate from it
        candidateId: "recAnna",
      })
    );
  });

  it("needs the login token for the list of e-mails", async () => {
    expect((await request(app).get("/api/outbox")).status).toBe(401);
  });

  it("does not put anything else than a candidate id into the formula", async () => {
    const res = await request(app)
      .get(`/api/candidates/${encodeURIComponent("x' OR 1=1")}/outbox`)
      .set(auth());

    expect(res.body).toEqual([]);
    expect(airtable.get).not.toHaveBeenCalled();
  });

  it("empties the outbox when the job offer is deleted", async () => {
    airtableData({ "/outbox": { records: [emailRow("recE1", "Anna"), emailRow("recE2", "Bartek")] } });

    const res = await request(app).delete("/api/job-offers/recJobOffer1").set(auth());

    expect(res.status).toBe(200);
    expect(airtable.delete).toHaveBeenCalledWith("/jobOffers/recJobOffer1");
    expect(airtable.delete).toHaveBeenCalledWith("/outbox", { params: { records: ["recE1", "recE2"] } });
  });
});

describe("POST /api/job-offers/preview", () => {
  const preview = (body: object) =>
    request(app).post("/api/job-offers/preview").set(auth()).send(body);

  beforeEach(() => airtableData({ "/candidates/recAnna": candidates[0] }));

  it("shows a draft as the chosen candidate would get it", async () => {
    const res = await preview({ subject: "For {{name}}", message: "Hi {{name}} {{surname}}", candidateId: "recAnna" });

    expect(res.status).toBe(200);
    expect(res.body.subject).toBe("For Anna");
    expect(res.body.to).toBe("anna@example.com");
    expect(res.body.toName).toBe("Anna Nowak");
    expect(res.body.html).toContain("Hi Anna Nowak");
    expect(airtable.post).not.toHaveBeenCalled();
    expect(airtable.patch).not.toHaveBeenCalled();
  });

  it("explains an unknown placeholder", async () => {
    const res = await preview({ subject: "{{nme}}", message: "x", candidateId: "recAnna" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("{{nme}}");
  });

  it("needs a real candidate id", async () => {
    const res = await preview({ subject: "a", message: "b", candidateId: "x' OR 1=1" });

    expect(res.status).toBe(404);
    expect(airtable.get).not.toHaveBeenCalled();
  });
});

describe("/api/opt-out/:token (public)", () => {
  beforeEach(() => airtableData({ "/candidates/recAnna": candidates[0] }));

  it("says whose link it is - without the login token", async () => {
    const res = await request(app).get(`/api/opt-out/${createOptOutToken("recAnna")}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ email: "anna@example.com", isOptedOut: false });
  });

  it("opts out the candidate", async () => {
    const res = await request(app).post(`/api/opt-out/${createOptOutToken("recAnna")}`);

    expect(res.status).toBe(200);
    expect(airtable.patch).toHaveBeenCalledWith("/candidates/recAnna", {
      fields: { status: "opted out" },
      typecast: true,
    });
  });

  it("refuses a link that is not valid", async () => {
    const res = await request(app).post("/api/opt-out/recAnna.forged");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("This opt-out link is not valid");
    expect(airtable.patch).not.toHaveBeenCalled();
  });
});
