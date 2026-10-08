import { formattedData } from "helpers";
import { useEmailPreview } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// links in the e-mail (e.g. "Unsubscribe") open in a new tab, not inside the preview
const withLinksInNewTab = (html: string) =>
  html.replace("<body", '<head><base target="_blank"></head><body');

interface EmailPreviewPanelProps {
  emailId: string | null;
  onClose: () => void;
}

// one e-mail of the outbox exactly as its recipient got it
const EmailPreviewPanel = ({ emailId, onClose }: EmailPreviewPanelProps) => {
  const { data: email, isLoading, isError } = useEmailPreview(emailId);

  return (
    <Sheet open={Boolean(emailId)} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-2xl"
      >
        <SheetHeader className="border-b p-6">
          <SheetTitle className="pr-8 text-lg">{email?.subject ?? "E-mail"}</SheetTitle>
          <SheetDescription>
            {email
              ? `To ${email.to} · ${formattedData.getFormattedDateTime(email.sentAt)}`
              : isError
                ? "This e-mail does not exist."
                : ""}
          </SheetDescription>
        </SheetHeader>

        {isLoading && <Loader title="Loading the e-mail..." />}
        {email && (
          // the e-mail's own HTML - sandboxed: no scripts, no access to the app
          <iframe
            title={`E-mail to ${email.to}`}
            srcDoc={withLinksInNewTab(email.html)}
            sandbox="allow-popups allow-popups-to-escape-sandbox"
            className="min-h-0 w-full flex-1 bg-white"
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EmailPreviewPanel;
