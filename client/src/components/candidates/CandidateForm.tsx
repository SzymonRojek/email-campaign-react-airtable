import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { normalizeText, statusLabel, validationCandidate } from "helpers";
import { useCandidates } from "customHooks/queries";
import { useLeaveGuard } from "customHooks/useLeaveGuard";
import DiscardChangesDialog from "components/DiscardChangesDialog";
import TextField from "components/form/TextField";
import SelectField from "components/form/SelectField";
import { SelectOption, CandidateFormValues } from "types";
import { PUBLIC_DEMO_NOTICE } from "./publicDemoNotice";
import { Button } from "@/components/ui/button";

const statusOptions: SelectOption[] = (
  ["open to offers", "awaiting consent", "do not contact", "opted out"] as const
).map((status) => ({ value: status, label: statusLabel(status) }));

const emptyValues = {
  name: "",
  surname: "",
  email: "",
  role: "",
  expectedSalary: "",
  phone: "",
} as CandidateFormValues;

interface CandidateFormProps {
  defaultValues?: CandidateFormValues;
  submitLabel: string;
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  // e.g. back to the details - asks first when something was changed
  onCancel: () => void;
  // the edited candidate may keep their own e-mail
  currentId?: string;
}

// the add / edit form in the candidate panel: fields scroll, the buttons stay at the bottom
const CandidateForm = ({
  defaultValues = emptyValues,
  submitLabel,
  onSubmit,
  onCancel,
  currentId,
}: CandidateFormProps) => {
  // the list is usually cached already - used for the duplicate e-mail check
  const { data: candidates } = useCandidates();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CandidateFormValues>({
    resolver: yupResolver(validationCandidate),
    defaultValues,
  });

  const { blocker, whileSaving, discard, restoreFocus, formProps } =
    useLeaveGuard(isDirty);

  const submit = handleSubmit(async (values) => {
    // the server checks it too - this answers at once, next to the field
    const owner = candidates?.find(
      ({ id, fields }) =>
        id !== currentId && normalizeText(fields.email) === normalizeText(values.email)
    );

    if (owner) {
      setError("email", {
        message: `this e-mail is already used by ${owner.fields.name} ${owner.fields.surname}`,
      });
      return;
    }

    await whileSaving(() => onSubmit(values));
  });

  return (
    <form {...formProps} onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="grid gap-5 overflow-y-auto p-6">
        <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {PUBLIC_DEMO_NOTICE}
        </p>
        <p className="text-sm text-muted-foreground">
          Name, surname, e-mail and status are required.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="Name"
            autoComplete="given-name"
            registration={register("name")}
            error={errors.name?.message}
          />
          <TextField
            id="surname"
            label="Surname"
            autoComplete="family-name"
            registration={register("surname")}
            error={errors.surname?.message}
          />
        </div>

        <TextField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <SelectField
          control={control}
          name="status"
          id="status-id"
          label="Status"
          placeholder="Select status"
          options={statusOptions}
          error={errors.status?.message}
        />

        <TextField
          id="role"
          label="Role (optional)"
          registration={register("role")}
          error={errors.role?.message}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="expectedSalary"
            label="Expected salary per month (optional)"
            registration={register("expectedSalary")}
            error={errors.expectedSalary?.message}
          />
          <TextField
            id="phone"
            label="Phone (optional, +44)"
            type="tel"
            autoComplete="tel-national"
            registration={register("phone")}
            error={errors.phone?.message}
          />
        </div>
      </div>

      <div className="mt-auto flex gap-2 border-t p-4">
        <Button type="button" variant="outline" className="h-10 flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="brand"
          className="h-10 flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>

      <DiscardChangesDialog
        blocker={blocker}
        onDiscard={discard}
        onKeepEditing={restoreFocus}
      />
    </form>
  );
};

export default CandidateForm;
