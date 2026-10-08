import { formattedData } from "helpers";
import LogoMark from "components/LogoMark";
import { EmailPreview } from "types";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// links in the e-mail (e.g. "Unsubscribe") open in a new tab, not inside the preview
const withLinksInNewTab = (html: string) =>
  html.replace("<head>", '<head><base target="_blank">');

// one e-mail the way an inbox shows it: the subject, who sent it to whom and when,
// then the message itself
const EmailMessage = ({ email }: { email: EmailPreview }) => (
  <>
    <SheetHeader className="gap-4 border-b p-6">
      <SheetTitle className="pr-8 text-xl font-normal">{email.subject}</SheetTitle>
      <div className="flex items-start gap-3">
        <LogoMark className="size-10 rounded-full" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate">
            <span className="font-semibold">{email.from.name}</span>{" "}
            <span className="text-xs text-muted-foreground">&lt;{email.from.address}&gt;</span>
          </p>
          <SheetDescription className="truncate text-xs">
            to {email.toName ? `${email.toName} <${email.to}>` : email.to}
          </SheetDescription>
        </div>
        {email.sentAt && (
          <time dateTime={email.sentAt} className="shrink-0 text-xs text-muted-foreground">
            {formattedData.getFormattedDateTime(email.sentAt)}
          </time>
        )}
      </div>
    </SheetHeader>

    {/* the e-mail's own HTML - sandboxed: no scripts, no access to the app */}
    <iframe
      title={`E-mail to ${email.to}`}
      srcDoc={withLinksInNewTab(email.html)}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      className="min-h-0 w-full flex-1 bg-white"
    />
  </>
);

export default EmailMessage;
