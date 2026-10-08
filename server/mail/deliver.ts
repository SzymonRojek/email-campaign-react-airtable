import { BuiltEmail } from "./buildEmail";

// where the e-mails go - MAIL_TRANSPORT:
//   "outbox"  (default) - only saved in the app's outbox (the "emails" table);
//             the free Render plan blocks outgoing SMTP, and the demo must not mail anyone
//   "ethereal" - locally: also sent through a test SMTP server (ethereal.email) that
//             catches every e-mail; the preview links are written to the log
// a real e-mail service (an HTTP API) would be one more case here
export const mailTransport = () =>
  process.env.MAIL_TRANSPORT === "ethereal" ? "ethereal" : "outbox";

export const deliver = async (emails: BuiltEmail[]) => {
  if (mailTransport() !== "ethereal" || emails.length === 0) return;

  // loaded only when used - production does not need it
  const nodemailer = await import("nodemailer");
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });

  for (const email of emails) {
    const { from, to, subject, html, text } = email;
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log(`Ethereal preview for ${email.to}: ${nodemailer.getTestMessageUrl(info)}`);
  }
};
