// one campaign e-mail for one subscriber - the same HTML for "sending" and for the preview

export interface EmailInput {
  campaign: { title?: string; description?: string };
  recipient: { name?: string; email?: string };
  unsubscribeUrl: string;
}

export interface BuiltEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// the campaign text comes from the users - it must not become HTML
const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// e-mail programs ignore <style> sheets - every style is inline
export const buildEmail = ({ campaign, recipient, unsubscribeUrl }: EmailInput): BuiltEmail => {
  const name = recipient.name?.trim() || "there";
  const subject = campaign.title?.trim() || "(no subject)";
  const body = escapeHtml(campaign.description).replace(/\n/g, "<br>");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#142f43">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
      <tr>
        <td style="background:#142f43;color:#ffa500;padding:16px 24px;font-weight:bold;font-size:15px">Email Campaign Dashboard</td>
      </tr>
      <tr>
        <td style="padding:28px 24px;font-size:16px;line-height:1.6">
          <h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(subject)}</h1>
          <p style="margin:0 0 16px">Hello ${escapeHtml(name)},</p>
          <p style="margin:0 0 24px">${body}</p>
          <p style="margin:0">Best wishes,<br>Email Campaign Dashboard</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
          You get this e-mail because you subscribed to our campaigns.
          <a href="${escapeHtml(unsubscribeUrl)}" style="color:#6b7280">Unsubscribe</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    subject,
    "",
    `Hello ${name},`,
    "",
    campaign.description ?? "",
    "",
    "Best wishes,",
    "Email Campaign Dashboard",
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { to: recipient.email ?? "", subject, html, text };
};
