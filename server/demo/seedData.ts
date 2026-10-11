import { JobOfferFields, CandidateFields } from "../types";

// the demo data the daily reset brings back
// daysAgo + time instead of a fixed date - the examples never look old

interface SeedRecord<Fields> {
  daysAgo: number;
  time: string; // HH:MM, UTC
  fields: Fields;
}

// a job offer goes to the active candidates in these roles (all of them without a list)
interface SeedJobOffer extends SeedRecord<JobOfferFields> {
  roles?: string[];
}

// a talent pool of a small recruitment agency; expectedSalary = expected, per month
export const seedCandidates: SeedRecord<CandidateFields>[] = [
  { daysAgo: 40, time: "09:15", fields: { name: "Emma", surname: "Johnson", email: "emma.johnson@example.com", status: "open to offers", role: "Frontend Developer", expectedSalary: "17000", phone: "5012345671" } },
  { daysAgo: 38, time: "14:40", fields: { name: "Liam", surname: "Smith", email: "liam.smith@example.com", status: "open to offers", role: "Backend Developer", expectedSalary: "21000", phone: "5012345672" } },
  { daysAgo: 35, time: "11:05", fields: { name: "Olivia", surname: "Brown", email: "olivia.brown@example.com", status: "open to offers", role: "UX Designer", expectedSalary: "14000", phone: "5012345673" } },
  { daysAgo: 30, time: "16:20", fields: { name: "Noah", surname: "Williams", email: "noah.williams@example.com", status: "awaiting consent", role: "DevOps Engineer", expectedSalary: "24000", phone: "5012345674" } },
  { daysAgo: 28, time: "08:30", fields: { name: "Ava", surname: "Jones", email: "ava.jones@example.com", status: "open to offers", role: "QA Engineer", expectedSalary: "12000", phone: "5012345675" } },
  { daysAgo: 26, time: "13:55", fields: { name: "James", surname: "Miller", email: "james.miller@example.com", status: "do not contact", role: "Backend Developer", expectedSalary: "19000", phone: "5012345676" } },
  { daysAgo: 20, time: "10:10", fields: { name: "Sophia", surname: "Davis", email: "sophia.davis@example.com", status: "open to offers", role: "Frontend Developer", expectedSalary: "22000", phone: "5012345677" } },
  { daysAgo: 16, time: "17:45", fields: { name: "Oliver", surname: "Wilson", email: "oliver.wilson@example.com", status: "awaiting consent", role: "Data Analyst", expectedSalary: "13000", phone: "5012345678" } },
  { daysAgo: 15, time: "09:00", fields: { name: "Isabella", surname: "Moore", email: "isabella.moore@example.com", status: "open to offers", role: "QA Engineer", expectedSalary: "15500", phone: "5012345679" } },
  { daysAgo: 4, time: "15:25", fields: { name: "Lucas", surname: "Taylor", email: "lucas.taylor@example.com", status: "do not contact", role: "Product Manager", expectedSalary: "20000", phone: "5012345680" } },
  { daysAgo: 3, time: "12:05", fields: { name: "Mia", surname: "Anderson", email: "mia.anderson@example.com", status: "open to offers", role: "Frontend Developer", expectedSalary: "26000", phone: "5012345681" } },
  { daysAgo: 1, time: "10:35", fields: { name: "Ethan", surname: "Thomas", email: "ethan.thomas@example.com", status: "open to offers", role: "Backend Developer", expectedSalary: "16000", phone: "5012345682" } },
];

const signature = "Best regards,\nAnna Nowak\nTalent Partner";

// the drafts show what a new offer does: a frontend offer skips the candidates
// who got one 5 days ago (the "contacted in the last 14 days" guard)
export const seedJobOffers: SeedJobOffer[] = [
  { daysAgo: 24, time: "10:00", fields: { subject: "Welcome to our talent pool", message: `Thank you for joining our talent pool as a {{role}}.\n\nWe will write only when we have an offer that fits your role and expectations - no spam.\n\n${signature}`, status: "sent" } },
  { daysAgo: 12, time: "12:30", roles: ["QA Engineer"], fields: { subject: "QA Engineer - hybrid, Krakow", message: `I have an offer that could fit you as a {{role}}.\n\nQA Engineer at a travel-tech company\n- hybrid, 2 days a week in Krakow\n- 12,000-16,000 / month\n- Playwright, API testing, a team of 6\n\nInterested? Just reply to this e-mail and we will set up a 15-minute call.\n\n${signature}`, status: "sent" } },
  { daysAgo: 5, time: "09:45", roles: ["Frontend Developer"], fields: { subject: "Frontend Developer - fintech, remote", message: `I have an offer that could fit you as a {{role}}.\n\nFrontend Developer at a fintech company\n- fully remote\n- 16,000-22,000 / month\n- React, TypeScript, a design system\n\nInterested? Just reply to this e-mail and we will set up a 15-minute call.\n\n${signature}`, status: "sent" } },
  { daysAgo: 2, time: "08:15", fields: { subject: "Senior React Developer - remote, 20-26k", message: `I have an offer that could fit you as a {{role}}.\n\nSenior React Developer at an e-commerce platform\n- fully remote, B2B\n- 20,000-26,000 / month\n- React, Next.js, TypeScript, a team of 8\n\nInterested? Just reply to this e-mail and we will set up a 15-minute call.\n\n${signature}`, status: "draft" } },
  { daysAgo: 0, time: "07:00", fields: { subject: "Backend Developer (Node.js) - B2B", message: `I have an offer that could fit you as a {{role}}.\n\nBackend Developer at a logistics start-up\n- remote or Warsaw\n- 18,000-24,000 / month\n- Node.js, PostgreSQL, AWS\n\nInterested? Just reply to this e-mail and we will set up a 15-minute call.\n\n${signature}`, status: "draft" } },
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

// the outbox of the sent example offers: every active candidate in the offer's roles who
// had already joined when it went out - pairs of indexes into the seeds above
export const seedOutbox = () =>
  seedJobOffers.flatMap((jobOffer, jobOfferIndex) =>
    jobOffer.fields.status !== "sent"
      ? []
      : seedCandidates
          .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
          .filter(
            ({ candidate: { fields, daysAgo } }) =>
              fields.status === "open to offers" &&
              daysAgo > jobOffer.daysAgo &&
              (!jobOffer.roles || jobOffer.roles.includes(fields.role ?? ""))
          )
          .map(({ candidateIndex }) => ({ jobOfferIndex, candidateIndex }))
  );
