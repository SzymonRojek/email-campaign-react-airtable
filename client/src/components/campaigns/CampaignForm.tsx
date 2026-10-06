import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send, Users } from "lucide-react";

import { validationCampaign } from "helpers";
import { DEMO_EMAIL_NOTICE } from "sendEmail";
import { useRecipients } from "customHooks/useRecipients";
import TextField from "components/form/TextField";
import { CampaignFormValues } from "types";
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
  // clear the form after saving (a new campaign)
  resetAfterSubmit?: boolean;
}

const CampaignForm = ({
  defaultValues = emptyValues,
  onDraft,
  onSend,
  resetAfterSubmit = false,
}: CampaignFormProps) => {
  const [isRecipientsOpen, setIsRecipientsOpen] = useState(false);
  const { hasNoActiveSubscribers, label } = useRecipients();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: yupResolver(validationCampaign),
    defaultValues,
  });

  const submitWith = (action: (values: CampaignFormValues) => Promise<void>) =>
    handleSubmit(async (values) => {
      await action(values);
      if (resetAfterSubmit) reset(emptyValues);
    });

  return (
    <Card className="mx-auto w-full max-w-2xl">
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
              onClick={submitWith(onSend)}
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
    </Card>
  );
};

export default CampaignForm;
