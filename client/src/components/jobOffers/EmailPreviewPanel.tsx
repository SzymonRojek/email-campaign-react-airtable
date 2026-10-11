import { useEmailPreview } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EmailMessage from "./EmailMessage";

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
        className="gap-0 p-0 outline-none data-[side=right]:w-full sm:data-[side=right]:max-w-2xl"
      >
        {email ? (
          <EmailMessage email={email} />
        ) : (
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-lg">E-mail</SheetTitle>
            <SheetDescription>{isError ? "This e-mail does not exist." : ""}</SheetDescription>
          </SheetHeader>
        )}
        {isLoading && <Loader title="Loading the e-mail..." />}
      </SheetContent>
    </Sheet>
  );
};

export default EmailPreviewPanel;
