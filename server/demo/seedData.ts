import { CampaignFields, SubscriberFields } from "../types";

// the demo data the daily reset brings back
// daysAgo + time instead of a fixed date - the examples never look old

interface SeedRecord<Fields> {
  daysAgo: number;
  time: string; // HH:MM, UTC
  fields: Fields;
}

export const seedSubscribers: SeedRecord<SubscriberFields>[] = [
  { daysAgo: 25, time: "09:15", fields: { name: "Emma", surname: "Johnson", email: "emma.johnson@example.com", status: "active", profession: "tester", salary: "6500", telephone: "5012345671" } },
  { daysAgo: 23, time: "14:40", fields: { name: "Liam", surname: "Smith", email: "liam.smith@example.com", status: "active", profession: "developer", salary: "9800", telephone: "5012345672" } },
  { daysAgo: 20, time: "11:05", fields: { name: "Olivia", surname: "Brown", email: "olivia.brown@example.com", status: "active", profession: "designer", salary: "7200", telephone: "5012345673" } },
  { daysAgo: 17, time: "16:20", fields: { name: "Noah", surname: "Williams", email: "noah.williams@example.com", status: "pending", profession: "manager", salary: "8800", telephone: "5012345674" } },
  { daysAgo: 15, time: "08:30", fields: { name: "Ava", surname: "Jones", email: "ava.jones@example.com", status: "active", profession: "teacher", salary: "5400", telephone: "5012345675" } },
  { daysAgo: 12, time: "13:55", fields: { name: "James", surname: "Miller", email: "james.miller@example.com", status: "blocked", profession: "lawyer", salary: "11000", telephone: "5012345676" } },
  { daysAgo: 9, time: "10:10", fields: { name: "Sophia", surname: "Davis", email: "sophia.davis@example.com", status: "active", profession: "architect", salary: "8300", telephone: "5012345677" } },
  { daysAgo: 6, time: "17:45", fields: { name: "Oliver", surname: "Wilson", email: "oliver.wilson@example.com", status: "pending", profession: "engineer", salary: "9100", telephone: "5012345678" } },
  { daysAgo: 3, time: "09:00", fields: { name: "Isabella", surname: "Moore", email: "isabella.moore@example.com", status: "active", profession: "accountant", salary: "7600", telephone: "5012345679" } },
  { daysAgo: 1, time: "15:25", fields: { name: "Lucas", surname: "Taylor", email: "lucas.taylor@example.com", status: "blocked", profession: "nurse", salary: "5900", telephone: "5012345680" } },
];

// {{name}} / {{surname}} become each recipient's own data; an empty line starts a paragraph
export const seedCampaigns: SeedRecord<CampaignFields>[] = [
  { daysAgo: 24, time: "10:00", fields: { title: "Welcome", description: "Thank you for joining our newsletter, {{name}}!\n\nOnce a month you will get our **best tips**, news about new courses and offers only for subscribers.\n\nSee you soon,\nThe Email Campaign Dashboard team", status: "sent" } },
  { daysAgo: 7, time: "12:30", fields: { title: "Autumn sale", description: "Up to **30% off** on all courses until the end of the month.\n\nPick a course you have been waiting for: https://example.com/courses\n\nHappy learning,\nThe Email Campaign Dashboard team", status: "sent" } },
  { daysAgo: 2, time: "09:45", fields: { title: "Product update", description: "Good news, {{name}}! Our app has two new features:\n\n**Dark mode** - easy on the eyes in the evening.\n**Faster search** - results while you type.\n\nThe Email Campaign Dashboard team", status: "draft" } },
  { daysAgo: 0, time: "07:00", fields: { title: "Winter webinar", description: "Join our *free* online webinar about testing in December, {{name}}.\n\nSave your seat: https://example.com/webinar\n\nThe Email Campaign Dashboard team", status: "draft" } },
];

// the fields Airtable gets - date counted back from now
export const toAirtableFields = <Fields>(
  { daysAgo, time, fields }: SeedRecord<Fields>,
  now: Date
) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(now);

  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(hours, minutes, 0, 0);

  // "today" examples must not be in the future when the reset runs early in the morning
  if (date > now) date.setUTCDate(date.getUTCDate() - 1);

  return { ...fields, date: date.toISOString() };
};

// the outbox of the sent example campaigns: every active subscriber who had
// already joined when the campaign went out - pairs of indexes into the seeds above
export const seedOutbox = () =>
  seedCampaigns.flatMap((campaign, campaignIndex) =>
    campaign.fields.status !== "sent"
      ? []
      : seedSubscribers
          .map((subscriber, subscriberIndex) => ({ subscriber, subscriberIndex }))
          .filter(
            ({ subscriber }) =>
              subscriber.fields.status === "active" && subscriber.daysAgo > campaign.daysAgo
          )
          .map(({ subscriberIndex }) => ({ campaignIndex, subscriberIndex }))
  );
