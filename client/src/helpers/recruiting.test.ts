import { formatSalary, statusLabel } from "helpers";
import {
  contactedAgo,
  daysSince,
  isRecentlyContacted,
  lastContactedByCandidate,
} from "helpers/lastContacted";
import { SentEmail } from "types";

const now = new Date(2026, 9, 11, 9, 0); // 11 Oct 2026, 9:00 local time
const at = (day: number, hour = 12) => new Date(2026, 9, day, hour, 0).toISOString();

const email = (candidateId: string, sentAt: string) =>
  ({ id: `${candidateId}-${sentAt}`, candidateId, sentAt }) as SentEmail;

describe("lastContactedByCandidate", () => {
  it("keeps the newest e-mail of every candidate", () => {
    const last = lastContactedByCandidate([
      email("anna", at(1)),
      email("anna", at(6)),
      email("bartek", at(3)),
      email("anna", at(2)),
    ]);

    expect(last.get("anna")).toBe(at(6));
    expect(last.get("bartek")).toBe(at(3));
    expect(last.has("celina")).toBe(false);
  });
});

describe("contacted ago", () => {
  it("counts calendar days - yesterday evening is yesterday", () => {
    expect(daysSince(at(10, 22), now)).toBe(1);
    expect(contactedAgo(at(11, 8), now)).toBe("today");
    expect(contactedAgo(at(10, 22), now)).toBe("yesterday");
    expect(contactedAgo(at(6), now)).toBe("5 days ago");
    // "1496 days ago" says nothing - an old one shows its date
    expect(contactedAgo(new Date(2022, 8, 6, 12).toISOString(), now)).toBe("2022/09/06");
  });

  it("is recent for 14 days", () => {
    expect(isRecentlyContacted(at(6), now)).toBe(true);
    expect(isRecentlyContacted(new Date(2026, 8, 28, 12).toISOString(), now)).toBe(true); // 13 days
    expect(isRecentlyContacted(new Date(2026, 8, 27, 12).toISOString(), now)).toBe(false); // 14 days
    expect(isRecentlyContacted(undefined, now)).toBe(false);
  });
});

describe("recruiter words", () => {
  it("names the statuses the way a recruiter does", () => {
    expect(statusLabel("open to offers")).toBe("Open to offers");
    expect(statusLabel("awaiting consent")).toBe("Awaiting consent");
    expect(statusLabel("do not contact")).toBe("Do not contact");
    expect(statusLabel("opted out")).toBe("Opted out");
    expect(statusLabel("draft")).toBe("Draft");
  });

  it("shows the expected salary per month", () => {
    expect(formatSalary("18000")).toBe("18,000 / month");
    expect(formatSalary(" 9500 ")).toBe("9,500 / month");
    expect(formatSalary("")).toBe("");
    expect(formatSalary(undefined)).toBe("");
  });
});
