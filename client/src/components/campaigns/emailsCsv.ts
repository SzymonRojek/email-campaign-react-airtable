import { toCsv } from "helpers/csv";

// "Autumn sale!" -> "autumn-sale"
const toFileName = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "campaign";

const today = () => new Date().toISOString().slice(0, 10);

export const recipientsFileName = (title = "") => `${toFileName(title)}-recipients-${today()}.csv`;
export const sentEmailsFileName = () => `sent-emails-${today()}.csv`;

// one row per e-mail; the campaign column only when the file has many campaigns
export const emailsToCsv = (
  emails: { name: string; email: string; sentAt: string; title?: string }[],
  withCampaign = false
) =>
  toCsv([
    [...(withCampaign ? ["campaign"] : []), "name", "email", "sentAt"],
    ...emails.map(({ title = "", name, email, sentAt }) => [
      ...(withCampaign ? [title] : []),
      name,
      email,
      sentAt,
    ]),
  ]);
