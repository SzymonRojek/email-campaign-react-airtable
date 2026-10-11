import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Send } from "lucide-react";

import { pluralize, validationJobOffer } from "helpers";
import { MESSAGE_MAX } from "helpers/validationJobOffer";
import { DEMO_EMAIL_NOTICE } from "./demoNotice";
import { useLeaveGuard } from "customHooks/useLeaveGuard";
import { useRecipients } from "customHooks/useRecipients";
import DiscardChangesDialog from "components/DiscardChangesDialog";
import TextField from "components/form/TextField";
import { JobOfferFormValues } from "types";
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
import { cn } from "@/lib/utils";
import JobOfferPreviewPanel from "./JobOfferPreviewPanel";
import RecipientsPicker from "./RecipientsPicker";

const emptyValues: JobOfferFormValues = { subject: "", message: "" };

interface JobOfferFormProps {
  defaultValues?: JobOfferFormValues;
  onDraft: (values: JobOfferFormValues) => Promise<void>;
  onSend: (values: JobOfferFormValues) => Promise<void>;
}

const JobOfferForm = ({
  defaultValues = emptyValues,
  onDraft,
  onSend,
}: JobOfferFormProps) => {
  // the form values waiting for "Send" in the confirmation
  const [toSend, setToSend] = useState<JobOfferFormValues | null>(null);
  // the form values shown in the preview panel
  const [toPreview, setToPreview] = useState<JobOfferFormValues | null>(null);
  const { receivers, hasNoActiveCandidates } = useRecipients();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<JobOfferFormValues>({
    resolver: yupResolver(validationJobOffer),
    defaultValues,
  });
  const message = useWatch({ control, name: "message" }) ?? "";


  const { blocker, whileSaving, discard, restoreFocus, formProps } =
    useLeaveGuard(isDirty);

  const submitWith = (action: (values: JobOfferFormValues) => Promise<void>) =>
    handleSubmit((values) => whileSaving(() => action(values)));

  // sending can not be undone - ask first (with nobody chosen the page explains it)
  const askToSend = handleSubmit((values) =>
    receivers.length ? setToSend(values) : whileSaving(() => onSend(values))
  );

  const recipientsText = pluralize(receivers.length, "candidate");

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        <form {...formProps} noValidate className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-sm text-muted-foreground">All fields are required.</p>

          <TextField
            id="subject"
            label="Subject"
            registration={register("subject")}
            error={errors.subject?.message}
          />

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={8}
              aria-invalid={Boolean(errors.message)}
              placeholder="I have an offer that could fit you as a {{role}}..."
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {"{{name}}, {{surname}} and {{role}} become each candidate's own data."}
            </p>
            {/* the counter shows up only near the limit */}
            {message.length > MESSAGE_MAX - 100 && (
              <p
                className={cn(
                  "text-right text-xs tabular-nums text-muted-foreground",
                  message.length > MESSAGE_MAX && "text-destructive"
                )}
              >
                {message.length}/{MESSAGE_MAX}
              </p>
            )}
          </div>

          <RecipientsPicker />

          <p className="text-sm text-muted-foreground italic">{DEMO_EMAIL_NOTICE}</p>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-10 sm:mr-auto"
              disabled={isSubmitting}
              onClick={handleSubmit(setToPreview)}
            >
              <Eye />
              Preview
            </Button>
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
              disabled={isSubmitting || hasNoActiveCandidates}
              onClick={askToSend}
            >
              <Send />
              Send email
            </Button>
          </div>
        </form>
      </CardContent>

      <JobOfferPreviewPanel
        values={toPreview}
        recipients={hasNoActiveCandidates ? [] : receivers}
        onClose={() => setToPreview(null)}
      />

      <AlertDialog open={Boolean(toSend)} onOpenChange={(isOpen) => !isOpen && setToSend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-brand/15 text-brand">
              <Send />
            </AlertDialogMedia>
            <AlertDialogTitle>Send "{toSend?.subject}"?</AlertDialogTitle>
            <AlertDialogDescription>
              It goes to {recipientsText}. A sent offer can not be changed or
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

      <DiscardChangesDialog
        blocker={blocker}
        onDiscard={discard}
        onKeepEditing={restoreFocus}
      />
    </Card>
  );
};

export default JobOfferForm;
