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
  // the outbox of "Welcome" - the active subscribers when it went out
  emails: [
    record("recEmailAnna0001", 6, {
      email: "anna@example.com",
      name: "Anna Nowak",
      subscriberId: "recSubAnna000001",
      campaignId: "recCampSent00002",
      sentAt: "2022-09-06T10:00:00.000Z",
    }),
    record("recEmailCeli0002", 6, {
      email: "celina@example.com",
      name: "Celina Wiśniewska",
      subscriberId: "recSubCelina0003",
      campaignId: "recCampSent00002",
      sentAt: "2022-09-06T10:00:00.000Z",
    }),
  ],
  // the reviewers' feedback - only the approved one is shown
  feedback: [
    record("recFeedback00001", 1, {
      name: "Marta Kowalska",
      role: "Frontend Developer",
      message: "Clean code and great tests.",
      approved: true,
    }),
    record("recFeedback00002", 2, {
      name: "Tom",
      role: "Recruiter",
      message: "Nice UX, works on my phone.",
      approved: true,
    }),
    record("recFeedback00005", 5, {
      name: "Jan Nowak",
      role: "Backend Developer",
      message:
        "The server never lets the Airtable token reach the browser, and the outbox is a smart way to show real e-mails on a free plan.",
      approved: true,
    }),
    record("recFeedback00006", 6, {
      name: "Ewa",
      message: "Easy to use.",
      approved: true,
    }),
    record("recFeedback00004", 4, {
      name: "Not Approved",
      message: "Waiting for a review.",
      approved: false,
    }),
  ],
};
