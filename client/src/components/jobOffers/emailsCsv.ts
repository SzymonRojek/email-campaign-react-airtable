import { toCsv } from "helpers/csv";

// "Autumn sale!" -> "autumn-sale"
const toFileName = (subject: string) =>
  subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "job-offer";

const today = () => new Date().toISOString().slice(0, 10);

export const recipientsFileName = (subject = "") => `${toFileName(subject)}-recipients-${today()}.csv`;
export const sentEmailsFileName = () => `sent-emails-${today()}.csv`;

// one row per e-mail; the job offer column only when the file has many job offers
export const emailsToCsv = (
  emails: { name: string; email: string; sentAt: string; subject?: string }[],
  withJobOffer = false
) =>
  toCsv([
    [...(withJobOffer ? ["jobOffer"] : []), "name", "email", "sentAt"],
    ...emails.map(({ subject = "", name, email, sentAt }) => [
      ...(withJobOffer ? [subject] : []),
      name,
      email,
      sentAt,
    ]),
  ]);
