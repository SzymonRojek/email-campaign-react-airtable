import { useState } from "react";

import { useCampaignPreview } from "customHooks/queries";
import { getErrorMessage } from "services";
import { Loader } from "components/DisplayMessage";
import { CampaignFormValues, Subscriber } from "types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EmailMessage from "./EmailMessage";

interface CampaignPreviewPanelProps {
  // the form values to show - null keeps the panel closed
  values: CampaignFormValues | null;
  recipients: Subscriber[];
  onClose: () => void;
}

// the campaign before it is sent, exactly as the chosen recipient will get it
const CampaignPreviewPanel = ({ values, recipients, onClose }: CampaignPreviewPanelProps) => {
  // the chosen recipient stays chosen for the next preview (while still a recipient)
  const [subscriberId, setSubscriberId] = useState<string>();
  const shownId = recipients.some(({ id }) => id === subscriberId) ? subscriberId : recipients[0]?.id;
  const { data: email, isLoading, isError, error } = useCampaignPreview(values, shownId);

  return (
    <Sheet open={Boolean(values)} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="gap-0 p-0 outline-none data-[side=right]:w-full sm:data-[side=right]:max-w-2xl"
      >
        <div className="flex flex-wrap items-center gap-3 border-b bg-muted/50 px-6 py-3 pr-14">
          <Label htmlFor="preview-recipient" className="text-muted-foreground">
            Preview for
          </Label>
          <Select value={shownId} onValueChange={setSubscriberId} disabled={!recipients.length}>
            <SelectTrigger id="preview-recipient" className="min-w-48 bg-background">
              <SelectValue placeholder="No recipients" />
            </SelectTrigger>
            <SelectContent>
              {recipients.map(({ id, fields }) => (
                <SelectItem key={id} value={id}>
                  {fields.name} {fields.surname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {email && !isError ? (
          <EmailMessage email={email} />
        ) : (
          <SheetHeader className="p-6">
            <SheetTitle className="text-lg">{values?.title}</SheetTitle>
            <SheetDescription>
              {isError
                ? `The preview is not available: ${getErrorMessage(error)}`
                : recipients.length
                  ? ""
                  : "There is nobody to preview the e-mail for - add an active subscriber first."}
            </SheetDescription>
          </SheetHeader>
        )}
        {isLoading && <Loader title="Preparing the preview..." />}
      </SheetContent>
    </Sheet>
  );
};

export default CampaignPreviewPanel;
