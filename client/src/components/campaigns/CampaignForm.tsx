import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send, Users } from "lucide-react";

import { pluralize, validationCampaign } from "helpers";
import { DEMO_EMAIL_NOTICE } from "sendEmail";
import { useLeaveGuard } from "customHooks/useLeaveGuard";
import { useRecipients } from "customHooks/useRecipients";
import DiscardChangesDialog from "components/DiscardChangesDialog";
import TextField from "components/form/TextField";
import { CampaignFormValues } from "types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RecipientsDialog from "./RecipientsDialog";

const emptyValues: CampaignFormValues = { title: "", description: "" };

interface CampaignFormProps {
  defaultValues?: CampaignFormValues;
  onDraft: (values: CampaignFormValues) => Promise<void>;
  onSend: (values: CampaignFormValues) => Promise<void>;
}

const CampaignForm = ({
  defaultValues = emptyValues,
  onDraft,
  onSend,
}: CampaignFormProps) => {
  const [isRecipientsOpen, setIsRecipientsOpen] = useState(false);
  // the form values waiting for "Send" in the confirmation
  const [toSend, setToSend] = useState<CampaignFormValues | null>(null);
  const { activeSubscribers, receivers, hasNoActiveSubscribers, label } =
    useRecipients();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CampaignFormValues>({
    resolver: yupResolver(validationCampaign),
    defaultValues,
  });

  const { blocker, whileSaving, discard } = useLeaveGuard(isDirty);

  const submitWith = (action: (values: CampaignFormValues) => Promise<void>) =>
    handleSubmit((values) => whileSaving(() => action(values)));

  // sending can not be undone - ask first (with nobody chosen the page explains it)
  const askToSend = handleSubmit((values) =>
    receivers.length ? setToSend(values) : whileSaving(() => onSend(values))
  );

  const recipientsText =
    receivers.length === activeSubscribers.length
      ? `all ${pluralize(receivers.length, "active subscriber")}`
      : `${receivers.length} of ${pluralize(activeSubscribers.length, "active subscriber")}`;

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        <form noValidate className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-sm text-muted-foreground">All fields are required.</p>

          <TextField
            id="title"
            label="Title"
            registration={register("title")}
            error={errors.title?.message}
          />

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : undefined}
              {...register("description")}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
            <p className="text-sm font-medium">{label}</p>
            <Button
              type="button"
              variant="outline"
              disabled={hasNoActiveSubscribers}
              onClick={() => setIsRecipientsOpen(true)}
            >
              <Users />
              Choose recipients
            </Button>
          </div>

          <p className="text-sm text-muted-foreground italic">{DEMO_EMAIL_NOTICE}</p>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={isSubmitting}
              onClick={submitWith(onDraft)}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              variant="brand"
              className="h-10"
              disabled={isSubmitting || hasNoActiveSubscribers}
              onClick={askToSend}
            >
              <Send />
              Send email
            </Button>
          </div>
        </form>
      </CardContent>

      <RecipientsDialog
        isOpen={isRecipientsOpen}
        onClose={() => setIsRecipientsOpen(false)}
      />

      <AlertDialog open={Boolean(toSend)} onOpenChange={(isOpen) => !isOpen && setToSend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-brand/15 text-brand">
              <Send />
            </AlertDialogMedia>
            <AlertDialogTitle>Send "{toSend?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              It goes to {recipientsText}. A sent campaign can not be changed or
              sent back. {DEMO_EMAIL_NOTICE}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="brand"
              onClick={() => {
                const values = toSend;
                setToSend(null);
                if (values) whileSaving(() => onSend(values));
              }}
            >
              <Send />
              Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DiscardChangesDialog blocker={blocker} onDiscard={discard} />
    </Card>
  );
};

export default CampaignForm;
