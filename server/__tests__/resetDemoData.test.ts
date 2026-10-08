import { axiosInstance } from "../controllers/axiosInstance";
import { resetDemoData } from "../demo/resetDemoData";
import {
  seedCampaigns,
  seedOutbox,
  seedSubscribers,
  toAirtableFields,
} from "../demo/seedData";

jest.mock("../controllers/axiosInstance", () => ({
  axiosInstance: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

const airtable = axiosInstance as unknown as Record<"get" | "post" | "delete", jest.Mock>;

const now = new Date("2026-10-08T01:00:00.000Z");
const daysBefore = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

// the seed as Airtable returns it after a reset
const asRecords = (seed: { fields: object }[], prefix: string, createdTime = daysBefore(1)) =>
  seed.map((record, i) => ({
    id: `${prefix}${i}`,
    createdTime,
    fields: { ...record.fields, date: "2026-01-01T00:00:00.000Z" } as Record<string, unknown>,
  }));

// an outbox as big as the seed's (the content does not matter for the check)
const outboxRecords = (count = seedOutbox().length) =>
  Array.from({ length: count }, (_, i) => ({
    id: `recE${i}`,
    createdTime: daysBefore(1),
    fields: { email: `e${i}@example.com` },
  }));

const tables = (
  subscribers: unknown[],
  campaigns: unknown[],
  emails: unknown[] = outboxRecords()
) =>
  airtable.get.mockImplementation((endpoint: string) =>
    Promise.resolve({
      data: {
        records:
          endpoint === "/subscribers" ? subscribers : endpoint === "/campaigns" ? campaigns : emails,
      },
    })
  );

const untouched = () => tables(asRecords(seedSubscribers, "recS"), asRecords(seedCampaigns, "recC"));

const reset = (options = {}) => resetDemoData({ now, pauseMs: 0, ...options });

// what was created in a table, in order
const created = (endpoint: string) =>
  airtable.post.mock.calls
    .filter(([path]) => path === endpoint)
    .flatMap(([, body]) => body.records.map(({ fields }: { fields: object }) => fields));

describe("resetDemoData", () => {
  beforeEach(() => {
    Object.values(airtable).forEach((mock) => mock.mockReset());
    // like Airtable: the new records, with ids, in the order they were sent
    let nextId = 0;
    airtable.post.mockImplementation((endpoint: string, body: { records: object[] }) =>
      Promise.resolve({
        data: {
          records: body.records.map((record) => ({ ...record, id: `new${endpoint}${nextId++}` })),
        },
      })
    );
    airtable.delete.mockResolvedValue({ data: {} });
  });

  it("skips the reset when nobody changed the data", async () => {
    untouched();

    await expect(reset()).resolves.toBe("skipped");

    expect(airtable.get).toHaveBeenCalledTimes(3);
    expect(airtable.delete).not.toHaveBeenCalled();
    expect(airtable.post).not.toHaveBeenCalled();
  });

  it("ignores the order of the records and of the fields", async () => {
    const reversed = asRecords(seedSubscribers, "recS")
      .reverse()
      .map((record) => ({
        ...record,
        fields: Object.fromEntries(Object.entries(record.fields).reverse()),
      }));
    tables(reversed, asRecords(seedCampaigns, "recC"));

    await expect(reset()).resolves.toBe("skipped");
  });

  it("ignores extra Airtable columns like Last Modified", async () => {
    const subscribers = asRecords(seedSubscribers, "recS");
    subscribers.forEach((record) => {
      record.fields["Last Modified"] = "2026-10-07T08:17:52.000Z";
    });
    tables(subscribers, asRecords(seedCampaigns, "recC"));

    await expect(reset()).resolves.toBe("skipped");
  });

  it("resets when a column of the examples was emptied", async () => {
    const subscribers = asRecords(seedSubscribers, "recS");
    delete subscribers[0].fields.profession;
    tables(subscribers, asRecords(seedCampaigns, "recC"));

    await expect(reset()).resolves.toBe("reset");
  });

  it("resets when the outbox changed (e.g. a campaign was sent)", async () => {
    tables(
      asRecords(seedSubscribers, "recS"),
      asRecords(seedCampaigns, "recC"),
      outboxRecords(seedOutbox().length + 3)
    );

    await expect(reset()).resolves.toBe("reset");
  });

  it("creates the new records before it deletes the old ones", async () => {
    tables([{ id: "recOld", createdTime: daysBefore(0), fields: { name: "Tomek" } }], []);

    await reset();

    const lastCreate = Math.max(...airtable.post.mock.invocationCallOrder);
    const [firstDelete] = airtable.delete.mock.invocationCallOrder;
    expect(lastCreate).toBeLessThan(firstDelete);
  });

  it("keeps the old records when Airtable refuses the new ones", async () => {
    tables([{ id: "recOld", createdTime: daysBefore(0), fields: { name: "Tomek" } }], []);
    airtable.post.mockRejectedValue(new Error('Unknown field name: "date"'));

    await expect(reset()).rejects.toThrow("Unknown field name");
    expect(airtable.delete).not.toHaveBeenCalled();
  });

  it("deletes everything and creates the examples again after a change", async () => {
    const subscribers = asRecords(seedSubscribers, "recS");
    subscribers[0].fields.name = "Changed";
    tables(
      [...subscribers, { id: "recNew", createdTime: daysBefore(0), fields: { name: "Tomek" } }],
      asRecords(seedCampaigns, "recC")
    );

    await expect(reset()).resolves.toBe("reset");

    // the examples, with their dates counted back from now
    expect(created("/subscribers")).toEqual(
      seedSubscribers.map((record) => toAirtableFields(record, now))
    );
    expect(created("/campaigns")).toHaveLength(seedCampaigns.length);

    // 11 subscribers = 2 delete requests (max 10 records each), 4 campaigns and the outbox 1 each
    const deleted = (endpoint: string) =>
      airtable.delete.mock.calls
        .filter(([path]) => path === endpoint)
        .flatMap(([, { params }]) => params.records);
    expect(deleted("/subscribers")).toEqual([...subscribers.map(({ id }) => id), "recNew"]);
    expect(deleted("/campaigns")).toHaveLength(seedCampaigns.length);
    expect(deleted("/emails")).toHaveLength(seedOutbox().length);
  });

  it("fills the outbox of the sent examples with the new ids", async () => {
    tables([], [], []);

    await reset();

    const emails = created("/emails");

    expect(emails).toHaveLength(seedOutbox().length);
    // Emma got the first sent example ("Welcome")
    expect(emails[0]).toMatchObject({
      email: "emma.johnson@example.com",
      name: "Emma Johnson",
      subscriberId: "new/subscribers0",
      campaignId: `new/campaigns${seedSubscribers.length}`,
    });
    // only ids of the records created now
    emails.forEach(({ subscriberId, campaignId }: Record<string, string>) => {
      expect(subscriberId).toMatch(/^new\/subscribers/);
      expect(campaignId).toMatch(/^new\/campaigns/);
    });
  });

  it("resets untouched examples older than 7 days (fresh dates)", async () => {
    tables(
      asRecords(seedSubscribers, "recS", daysBefore(8)),
      asRecords(seedCampaigns, "recC", daysBefore(8))
    );

    await expect(reset()).resolves.toBe("reset");
  });

  it("resets untouched data when forced", async () => {
    untouched();

    await expect(reset({ force: true })).resolves.toBe("reset");
    expect(created("/subscribers")).toHaveLength(seedSubscribers.length);
  });

  it("never touches the feedback of the reviewers", async () => {
    tables([], []);

    await reset({ force: true });

    const touched = [...airtable.get.mock.calls, ...airtable.post.mock.calls, ...airtable.delete.mock.calls];
    expect(touched.some(([path]) => String(path).startsWith("/feedback"))).toBe(false);
  });

  it("fills empty tables", async () => {
    tables([], [], []);

    await expect(reset()).resolves.toBe("reset");
    expect(airtable.delete).not.toHaveBeenCalled();
  });
});

describe("seedOutbox", () => {
  it("sends the examples only to active subscribers who had joined before", () => {
    const outbox = seedOutbox().map(({ campaignIndex, subscriberIndex }) => [
      seedCampaigns[campaignIndex].fields.title,
      seedSubscribers[subscriberIndex].fields.name,
    ]);

    expect(outbox).toEqual([
      ["Welcome", "Emma"],
      ["Autumn sale", "Emma"],
      ["Autumn sale", "Liam"],
      ["Autumn sale", "Olivia"],
      ["Autumn sale", "Ava"],
      ["Autumn sale", "Sophia"],
    ]);
  });
});

describe("toAirtableFields", () => {
  it("counts the date back from now", () => {
    const fields = toAirtableFields(
      { daysAgo: 3, time: "09:15", fields: { name: "Anna" } },
      now
    );

    expect(fields).toEqual({ name: "Anna", date: "2026-10-05T09:15:00.000Z" });
  });

  it("never puts a date in the future", () => {
    // the reset runs at 01:00 - "today 07:00" has not happened yet
    const { date } = toAirtableFields({ daysAgo: 0, time: "07:00", fields: {} }, now);

    expect(date).toBe("2026-10-07T07:00:00.000Z");
  });
});
