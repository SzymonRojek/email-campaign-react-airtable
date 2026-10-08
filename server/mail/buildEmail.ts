// one campaign e-mail for one subscriber - the same HTML for "sending" and for the previews

export interface EmailInput {
  campaign: { title?: string; description?: string };
  recipient: { name?: string; surname?: string; email?: string };
  unsubscribeUrl: string;
}

export interface BuiltEmail {
  from: { name: string; address: string };
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const SENDER = { name: "Email Campaign Dashboard", address: "campaigns@example.com" };

// {{name}} and {{surname}} in the title and the text become the recipient's own data
export const PLACEHOLDERS = ["name", "surname"] as const;
type Placeholder = (typeof PLACEHOLDERS)[number];

const placeholderPattern = /\{\{\s*([^{}]*?)\s*\}\}/g;

const isPlaceholder = (key: string): key is Placeholder =>
  (PLACEHOLDERS as readonly string[]).includes(key);

// e.g. a typo: {{nmae}} - such a campaign is not sent
export const unknownPlaceholders = (...texts: (string | undefined)[]) => [
  ...new Set(
    texts.flatMap((text = "") =>
      [...text.matchAll(placeholderPattern)].map(([, key]) => key).filter((key) => !isPlaceholder(key))
    )
  ),
];

const fillIn = (text: string, values: Record<Placeholder, string>, encode = (value: string) => value) =>
  text.replace(placeholderPattern, (match, key: string) =>
    isPlaceholder(key) ? encode(values[key]) : match
  );

// the campaign text comes from the users - it must not become HTML
const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// the text stays as written - only the addresses in it (already escaped) become links
const linkify = (escaped: string) =>
  escaped.replace(
    /\bhttps?:\/\/[^\s<]*[^\s<.,;:!?)]/g,
    (url) => `<a href="${url}" style="color:#1a73e8">${url}</a>`
  );

// an empty line starts a new paragraph, a single line break stays a line break
const paragraphs = (escaped: string) =>
  escaped
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 16px">${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("\n      ");

// plain like a personal message - e-mail programs ignore <style> sheets, so styles are inline
export const buildEmail = ({ campaign, recipient, unsubscribeUrl }: EmailInput): BuiltEmail => {
  const values = { name: recipient.name?.trim() ?? "", surname: recipient.surname?.trim() ?? "" };
  const greeting = `Hello ${values.name || "there"},`;
  const subject = fillIn(campaign.title?.trim() || "(no subject)", values);
  const description = (campaign.description ?? "").replace(/\r\n/g, "\n");
  // placeholders are filled in last, so a name never becomes a link or HTML
  const body = fillIn(paragraphs(linkify(escapeHtml(description))), values, escapeHtml);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#202124">
    <div style="max-width:600px">
      <p style="margin:0 0 16px">${escapeHtml(greeting)}</p>
      ${body}
      <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e8eaed;font-size:12px;line-height:1.5;color:#5f6368">
        You get this e-mail because you subscribed to our campaigns.
        <a href="${escapeHtml(unsubscribeUrl)}" style="color:#5f6368">Unsubscribe</a>
      </p>
    </div>
  </body>
</html>`;

  const text = [
    greeting,
    "",
    fillIn(description.trim(), values),
    "",
    "--",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { from: SENDER, to: recipient.email ?? "", subject, html, text };
};
