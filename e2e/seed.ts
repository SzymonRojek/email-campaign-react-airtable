// shared by the fake Airtable, the Playwright config and the tests

export const AIRTABLE_PORT = 5099;
export const APP_PORT = 5055;
export const API_KEY = "patE2E";
export const ADMIN_PASSWORD = "e2e-password";

const record = (id: string, day: number, fields: Record<string, unknown>) => ({
  id,
  createdTime: `2022-09-${String(day).padStart(2, "0")}T10:00:00.000Z`,
  fields: { ...fields, date: `2022-09-${String(day).padStart(2, "0")}T10:00:00.000Z` },
});

export const seed = {
  subscribers: [
    record("recSubAnna000001", 1, {
      name: "Anna",
      surname: "Nowak",
      email: "anna@example.com",
      status: "active",
      profession: "tester",
      salary: "5000",
      telephone: "3432342344",
    }),
    record("recSubBartek0002", 2, {
      name: "Bartek",
      surname: "Kowalski",
      email: "bartek@example.com",
      status: "blocked",
      profession: "developer",
      salary: "7000",
      telephone: "3432342345",
    }),
    record("recSubCelina0003", 3, {
      name: "Celina",
      surname: "Wiśniewska",
      email: "celina@example.com",
      status: "active",
      profession: "designer",
      salary: "6000",
      telephone: "3432342346",
    }),
    record("recSubDarek00004", 4, {
      name: "Darek",
      surname: "Lis",
      email: "darek@example.com",
      status: "pending",
      profession: "manager",
      salary: "8000",
      telephone: "3432342347",
    }),
  ],
  campaigns: [
    record("recCampDraft0001", 5, {
      title: "Autumn sale",
      description: "Discounts for everybody",
      status: "draft",
    }),
    record("recCampSent00002", 6, {
      title: "Welcome",
      description: "Hello new subscribers",
      status: "sent",
    }),
  ],
};
