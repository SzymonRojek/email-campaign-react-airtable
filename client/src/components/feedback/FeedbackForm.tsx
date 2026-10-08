import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircleCheck } from "lucide-react";

import validationFeedback, { FEEDBACK_MESSAGE_MAX } from "helpers/validationFeedback";
import { getErrorMessage } from "services";
import api from "services/api";
import TextField from "components/form/TextField";
import { FeedbackFormValues } from "types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  onClose: () => void;
}

// anybody can leave feedback (no login); it is shown only after a review
const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: yupResolver(validationFeedback),
    defaultValues: { name: "", role: "", message: "", isPublic: false },
  });
  const message = useWatch({ control, name: "message" }) ?? "";
  const [isSent, setIsSent] = useState(false);
  const trapRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      await api.post("/feedback", { ...values, website: trapRef.current?.value });
      setIsSent(true);
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
  };

  // the thank-you replaces the form - that is the confirmation
  if (isSent) {
    return (
      <div className="grid justify-items-center gap-3 py-4 text-center">
        <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <p className="font-medium">Thank you for your feedback!</p>
        <p className="text-sm text-muted-foreground">It will appear after a review.</p>
        <Button variant="outline" className="mt-2" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form noValidate className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="feedback-name"
          label="Name"
          autoComplete="given-name"
          registration={register("name")}
          error={errors.name?.message}
        />
        <TextField
          id="feedback-role"
          label="Role (optional)"
          autoComplete="organization-title"
          registration={register("role")}
          error={errors.role?.message}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="feedback-message">Your feedback</Label>
        <Textarea
          id="feedback-message"
          rows={5}
          placeholder="What do you like? What would you improve?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "feedback-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="feedback-message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
        {message.length > FEEDBACK_MESSAGE_MAX - 100 && (
          <p
            className={cn(
              "text-right text-xs tabular-nums text-muted-foreground",
              message.length > FEEDBACK_MESSAGE_MAX && "text-destructive"
            )}
          >
            {message.length}/{FEEDBACK_MESSAGE_MAX}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Controller
          control={control}
          name="isPublic"
          render={({ field }) => (
            <Checkbox
              id="feedback-public"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              className="mt-0.5"
            />
          )}
        />
        <Label htmlFor="feedback-public" className="leading-snug font-normal">
          Show my name, role and feedback in the app
        </Label>
      </div>

      {/* a trap for bots - people never see or fill it in */}
      <input
        ref={trapRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] size-px opacity-0"
      />

      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="brand" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send feedback"}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
