import { axiosInstance } from "../controllers/axiosInstance";
import { resetDemoData } from "../demo/resetDemoData";
import { seedCampaigns, seedSubscribers, toAirtableFields } from "../demo/seedData";

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

const tables = (subscribers: unknown[], campaigns: unknown[]) =>
  airtable.get.mockImplementation((endpoint: string) =>
    Promise.resolve({
      data: { records: endpoint === "/subscribers" ? subscribers : campaigns },
    })
  );

const reset = (options = {}) => resetDemoData({ now, pauseMs: 0, ...options });

describe("resetDemoData", () => {
  beforeEach(() => {
    Object.values(airtable).forEach((mock) => mock.mockReset());
    airtable.post.mockResolvedValue({ data: {} });
    airtable.delete.mockResolvedValue({ data: {} });
  });

  it("skips the reset when nobody changed the data", async () => {
    tables(asRecords(seedSubscribers, "recS"), asRecords(seedCampaigns, "recC"));

    await expect(reset()).resolves.toBe("skipped");

    expect(airtable.get).toHaveBeenCalledTimes(2);
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

  it("creates the new records before it deletes the old ones", async () => {
    tables([{ id: "recOld", createdTime: daysBefore(0), fields: { name: "Tomek" } }], []);

    await reset();

    const [firstCreate] = airtable.post.mock.invocationCallOrder;
    const [firstDelete] = airtable.delete.mock.invocationCallOrder;
    expect(firstCreate).toBeLessThan(firstDelete);
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

    // 11 subscribers = 2 delete requests (max 10 records each), 4 campaigns = 1
    expect(airtable.delete).toHaveBeenCalledTimes(3);
    expect(airtable.delete.mock.calls[0]).toEqual([
      "/subscribers",
      { params: { records: subscribers.slice(0, 10).map((record) => record.id) } },
    ]);
    expect(airtable.delete.mock.calls[1]).toEqual([
      "/subscribers",
      { params: { records: ["recNew"] } },
    ]);

    // 10 subscribers + 4 campaigns = 2 create requests
    expect(airtable.post).toHaveBeenCalledTimes(2);
    expect(airtable.post.mock.calls[0][0]).toBe("/subscribers");
    expect(airtable.post.mock.calls[0][1].records).toEqual(
      seedSubscribers.map((record) => ({ fields: toAirtableFields(record, now) }))
    );
    expect(airtable.post.mock.calls[1][0]).toBe("/campaigns");
    expect(airtable.post.mock.calls[1][1].records).toHaveLength(seedCampaigns.length);
  });

  it("resets when a record was removed", async () => {
    tables(asRecords(seedSubscribers, "recS").slice(1), asRecords(seedCampaigns, "recC"));

    await expect(reset()).resolves.toBe("reset");
  });

  it("resets untouched examples older than 7 days (fresh dates)", async () => {
    tables(
      asRecords(seedSubscribers, "recS", daysBefore(8)),
      asRecords(seedCampaigns, "recC", daysBefore(8))
    );

    await expect(reset()).resolves.toBe("reset");
  });

  it("resets untouched data when forced", async () => {
    tables(asRecords(seedSubscribers, "recS"), asRecords(seedCampaigns, "recC"));

    await expect(reset({ force: true })).resolves.toBe("reset");
    expect(airtable.post).toHaveBeenCalledTimes(2);
  });

  it("fills empty tables", async () => {
    tables([], []);

    await expect(reset()).resolves.toBe("reset");
    expect(airtable.delete).not.toHaveBeenCalled();
    expect(airtable.post).toHaveBeenCalledTimes(2);
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
