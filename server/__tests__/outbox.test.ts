import request from "supertest";

import { axiosInstance } from "../controllers/axiosInstance";
import { createToken } from "../helpers/authToken";
import { buildEmail, unknownPlaceholders } from "../mail/buildEmail";
import { createUnsubscribeToken, readUnsubscribeToken } from "../mail/unsubscribeToken";
import { app } from "../app";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const airtable = axiosInstance as unknown as Record<
  "get" | "post" | "patch" | "delete",
  jest.Mock
>;

const subscriber = (id: string, name: string, status = "active") => ({
  id,
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: { name, surname: "Nowak", email: `${name.toLowerCase()}@example.com`, status },
});

const subscribers = [
  subscriber("recAnna", "Anna"),
  subscriber("recBartek", "Bartek"),
  subscriber("recCelina", "Celina", "pending"),
  subscriber("recDarek", "Darek", "unsubscribed"),
];

const draft = {
  id: "recCampaign1",
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: { title: "Autumn sale", description: "Big <b>discounts</b>\nthis week", status: "draft" },
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
    campaign: { title: "Autumn <sale>", description: "Line 1\n<script>x</script>" },
    recipient: { name: "Anna", email: "anna@example.com" },
    unsubscribeUrl: "https://app.example.com/#/unsubscribe/abc.def",
  });

  it("is addressed and greets the subscriber by name", () => {
    expect(email.to).toBe("anna@example.com");
    expect(email.subject).toBe("Autumn <sale>");
    expect(email.html).toContain("Hello Anna,");
    expect(email.text).toContain("Hello Anna,");
  });

  it("does not let the campaign text become HTML", () => {
    expect(email.html).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("Autumn &lt;sale&gt;");
    expect(email.html).toContain("Line 1<br>");
  });

  it("has the unsubscribe link", () => {
    expect(email.html).toContain('href="https://app.example.com/#/unsubscribe/abc.def"');
    expect(email.text).toContain("Unsubscribe: https://app.example.com/#/unsubscribe/abc.def");
  });

  it("is a plain message - no banner, no repeated title", () => {
    expect(email.html).not.toContain("Email Campaign Dashboard");
    expect(email.html).not.toContain("<h1");
    expect(email.from).toEqual({ name: "Email Campaign Dashboard", address: "campaigns@example.com" });
  });
});

describe("templates", () => {
  const build = (title: string, description: string, recipient = { name: "Emma", surname: "Johnson" }) =>
    buildEmail({ campaign: { title, description }, recipient, unsubscribeUrl: "https://app/#/u/x" });

  it("fills in {{name}} and {{surname}} for every recipient", () => {
    const email = build("{{name}}, your discount", "Dear {{ name }} {{surname}}, welcome!");

    expect(email.subject).toBe("Emma, your discount");
    expect(email.html).toContain("Dear Emma Johnson, welcome!");
    expect(email.text).toContain("Dear Emma Johnson, welcome!");
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

describe("unsubscribe token", () => {
  it("reads back the subscriber id", () => {
    expect(readUnsubscribeToken(createUnsubscribeToken("recAnna"))).toBe("recAnna");
  });

  it.each([
    ["another subscriber's id", () => `recBartek.${createUnsubscribeToken("recAnna").split(".")[1]}`],
    ["a changed signature", () => `${createUnsubscribeToken("recAnna")}x`],
    ["no signature", () => "recAnna"],
    ["a login token", () => createToken()],
  ])("refuses %s", (_, makeToken) => {
    expect(readUnsubscribeToken(makeToken())).toBeNull();
  });

  it("stops working with another server secret", () => {
    const old = createUnsubscribeToken("recAnna");
    process.env.AUTH_SECRET = "another-secret";

    expect(readUnsubscribeToken(old)).toBeNull();
    process.env.AUTH_SECRET = "test-auth-secret";
  });
});

describe("POST /api/campaigns/:id/send", () => {
  const send = (body: object = {}) =>
    request(app).post("/api/campaigns/recCampaign1/send").set(auth()).send(body);

  beforeEach(() =>
    airtableData({
      "/campaigns/recCampaign1": draft,
      "/subscribers": { records: subscribers },
    })
  );

  it("needs the login token", async () => {
    expect((await request(app).post("/api/campaigns/recCampaign1/send")).status).toBe(401);
  });

  it("saves an e-mail for every active subscriber, then marks the campaign sent", async () => {
    const res = await send();

    expect(res.status).toBe(200);
    expect(res.body.sent).toBe(2);
    expect(airtable.post).toHaveBeenCalledWith("/emails", {
      records: [
        expect.objectContaining({
          fields: expect.objectContaining({ email: "anna@example.com", name: "Anna Nowak", subscriberId: "recAnna", campaignId: "recCampaign1" }),
        }),
        expect.objectContaining({
          fields: expect.objectContaining({ email: "bartek@example.com", subscriberId: "recBartek" }),
        }),
      ],
    });
    expect(airtable.patch).toHaveBeenCalledWith("/campaigns/recCampaign1", {
      fields: { status: "sent", date: res.body.sentAt },
    });
    expect(airtable.post.mock.invocationCallOrder[0]).toBeLessThan(
      airtable.patch.mock.invocationCallOrder[0]
    );
  });

  it("sends only to the chosen subscribers - and never to inactive ones", async () => {
    const res = await send({ recipientIds: ["recBartek", "recCelina", "recDarek"] });

    expect(res.body.sent).toBe(1);
    expect(airtable.post.mock.calls[0][1].records).toHaveLength(1);
    expect(airtable.post.mock.calls[0][1].records[0].fields.subscriberId).toBe("recBartek");
  });

  it("refuses when nobody can get it", async () => {
    const res = await send({ recipientIds: ["recCelina"] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("There are no active recipients");
    expect(airtable.post).not.toHaveBeenCalled();
    expect(airtable.patch).not.toHaveBeenCalled();
  });

  it("does not send a campaign twice", async () => {
    airtableData({
      "/campaigns/recCampaign1": { ...draft, fields: { ...draft.fields, status: "sent" } },
      "/subscribers": { records: subscribers },
    });

    const res = await send();

    expect(res.status).toBe(409);
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("refuses a campaign with an unknown placeholder", async () => {
    airtableData({
      "/campaigns/recCampaign1": { ...draft, fields: { ...draft.fields, description: "Hi {{nmae}}" } },
      "/subscribers": { records: subscribers },
    });

    const res = await send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Unknown placeholder: {{nmae}} - use {{name}} or {{surname}}");
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("saves the e-mails in batches of 10", async () => {
    airtableData({
      "/campaigns/recCampaign1": draft,
      "/subscribers": {
        records: Array.from({ length: 12 }, (_, i) => subscriber(`recS${i}`, `Person${i}`)),
      },
    });

    await send();

    expect(airtable.post).toHaveBeenCalledTimes(2);
    expect(airtable.post.mock.calls[1][1].records).toHaveLength(2);
  });
});

describe("the outbox of a campaign", () => {
  const emailRow = (id: string, name: string, campaignId = "recCampaign1") => ({
    id,
    createdTime: "2026-01-01T00:00:00.000Z",
    fields: { email: `${name.toLowerCase()}@example.com`, name: `${name} Nowak`, subscriberId: `rec${name}`, campaignId, sentAt: "2026-10-01T10:00:00.000Z" },
  });

  it("lists who got the campaign, by name", async () => {
    airtableData({
      "/emails": {
        records: [emailRow("recE2", "Bartek"), emailRow("recE1", "Anna"), emailRow("recE3", "Other", "recOther")],
      },
    });

    const res = await request(app).get("/api/campaigns/recCampaign1/emails").set(auth());

    expect(res.body.map(({ id }: { id: string }) => id)).toEqual(["recE1", "recE2"]);
    expect(airtable.get).toHaveBeenCalledWith("/emails", {
      params: { filterByFormula: "{campaignId}='recCampaign1'", offset: undefined },
    });
  });

  it("does not put anything else than a record id into the formula", async () => {
    const res = await request(app)
      .get(`/api/campaigns/${encodeURIComponent("x' OR 1=1")}/emails`)
      .set(auth());

    expect(res.body).toEqual([]);
    expect(airtable.get).not.toHaveBeenCalled();
  });

  it("shows an e-mail as its recipient got it", async () => {
    airtableData({
      "/emails/recE1": emailRow("recE1", "Anna"),
      "/campaigns/recCampaign1": { ...draft, fields: { ...draft.fields, status: "sent" } },
    });

    const res = await request(app).get("/api/emails/recE1/preview").set(auth());

    expect(res.status).toBe(200);
    expect(res.body.to).toBe("anna@example.com");
    expect(res.body.subject).toBe("Autumn sale");
    expect(res.body.html).toContain("Hello Anna,");
    expect(res.body.toName).toBe("Anna Nowak");
    expect(res.body.html).toMatch(/#\/unsubscribe\/recAnna\.[\w-]+/);
    expect(res.body.sentAt).toBe("2026-10-01T10:00:00.000Z");
  });

  it("lists the campaigns a subscriber got, newest first", async () => {
    const older = emailRow("recE1", "Anna");
    const newer = { ...emailRow("recE2", "Anna", "recCampaign2"), fields: { ...emailRow("recE2", "Anna", "recCampaign2").fields, sentAt: "2026-10-05T10:00:00.000Z" } };
    airtableData({
      "/emails": { records: [older, newer, emailRow("recE3", "Bartek")] },
      "/campaigns": {
        records: [
          { ...draft, fields: { ...draft.fields, status: "sent" } },
          { ...draft, id: "recCampaign2", fields: { ...draft.fields, title: "Winter", status: "sent" } },
        ],
      },
    });

    const res = await request(app).get("/api/subscribers/recAnna/emails").set(auth());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "recE2", campaignId: "recCampaign2", title: "Winter", sentAt: "2026-10-05T10:00:00.000Z" },
      { id: "recE1", campaignId: "recCampaign1", title: "Autumn sale", sentAt: "2026-10-01T10:00:00.000Z" },
    ]);
    expect(airtable.get).toHaveBeenCalledWith("/emails", {
      params: { filterByFormula: "{subscriberId}='recAnna'", offset: undefined },
    });
  });

  it("lists every sent e-mail with its campaign, newest first", async () => {
    const newer = emailRow("recE2", "Bartek", "recCampaign2");
    newer.fields.sentAt = "2026-10-05T10:00:00.000Z";
    airtableData({
      "/emails": { records: [emailRow("recE1", "Anna"), newer, emailRow("recE3", "Gone", "recDeleted")] },
      "/campaigns": {
        records: [draft, { ...draft, id: "recCampaign2", fields: { ...draft.fields, title: "Winter" } }],
      },
    });

    const res = await request(app).get("/api/emails").set(auth());

    expect(res.status).toBe(200);
    expect(res.body.map(({ id, title }: { id: string; title: string }) => [id, title])).toEqual([
      ["recE2", "Winter"],
      ["recE1", "Autumn sale"],
    ]);
    expect(res.body[1]).toEqual(
      expect.objectContaining({ name: "Anna Nowak", email: "anna@example.com", campaignId: "recCampaign1" })
    );
  });

  it("needs the login token for the list of e-mails", async () => {
    expect((await request(app).get("/api/emails")).status).toBe(401);
  });

  it("does not put anything else than a subscriber id into the formula", async () => {
    const res = await request(app)
      .get(`/api/subscribers/${encodeURIComponent("x' OR 1=1")}/emails`)
      .set(auth());

    expect(res.body).toEqual([]);
    expect(airtable.get).not.toHaveBeenCalled();
  });

  it("empties the outbox when the campaign is deleted", async () => {
    airtableData({ "/emails": { records: [emailRow("recE1", "Anna"), emailRow("recE2", "Bartek")] } });

    const res = await request(app).delete("/api/campaigns/recCampaign1").set(auth());

    expect(res.status).toBe(200);
    expect(airtable.delete).toHaveBeenCalledWith("/campaigns/recCampaign1");
    expect(airtable.delete).toHaveBeenCalledWith("/emails", { params: { records: ["recE1", "recE2"] } });
  });
});

describe("POST /api/campaigns/preview", () => {
  const preview = (body: object) =>
    request(app).post("/api/campaigns/preview").set(auth()).send(body);

  beforeEach(() => airtableData({ "/subscribers/recAnna": subscribers[0] }));

  it("shows a draft as the chosen subscriber would get it", async () => {
    const res = await preview({ title: "For {{name}}", description: "Hi {{name}} {{surname}}", subscriberId: "recAnna" });

    expect(res.status).toBe(200);
    expect(res.body.subject).toBe("For Anna");
    expect(res.body.to).toBe("anna@example.com");
    expect(res.body.toName).toBe("Anna Nowak");
    expect(res.body.html).toContain("Hi Anna Nowak");
    expect(airtable.post).not.toHaveBeenCalled();
    expect(airtable.patch).not.toHaveBeenCalled();
  });

  it("explains an unknown placeholder", async () => {
    const res = await preview({ title: "{{nme}}", description: "x", subscriberId: "recAnna" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("{{nme}}");
  });

  it("needs a real subscriber id", async () => {
    const res = await preview({ title: "a", description: "b", subscriberId: "x' OR 1=1" });

    expect(res.status).toBe(404);
    expect(airtable.get).not.toHaveBeenCalled();
  });
});

describe("/api/unsubscribe/:token (public)", () => {
  beforeEach(() => airtableData({ "/subscribers/recAnna": subscribers[0] }));

  it("says whose link it is - without the login token", async () => {
    const res = await request(app).get(`/api/unsubscribe/${createUnsubscribeToken("recAnna")}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ email: "anna@example.com", isUnsubscribed: false });
  });

  it("unsubscribes the subscriber", async () => {
    const res = await request(app).post(`/api/unsubscribe/${createUnsubscribeToken("recAnna")}`);

    expect(res.status).toBe(200);
    expect(airtable.patch).toHaveBeenCalledWith("/subscribers/recAnna", {
      fields: { status: "unsubscribed" },
      typecast: true,
    });
  });

  it("refuses a link that is not valid", async () => {
    const res = await request(app).post("/api/unsubscribe/recAnna.forged");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("This unsubscribe link is not valid");
    expect(airtable.patch).not.toHaveBeenCalled();
  });
});
