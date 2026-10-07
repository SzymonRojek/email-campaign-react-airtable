import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { normalizeText, validationSubscriber } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { useLeaveGuard } from "customHooks/useLeaveGuard";
import DiscardChangesDialog from "components/DiscardChangesDialog";
import TextField from "components/form/TextField";
import SelectField from "components/form/SelectField";
import { SelectOption, SubscriberFormValues } from "types";
import { Button } from "@/components/ui/button";

const statusOptions: SelectOption[] = [
  { value: "active", label: "active" },
  { value: "pending", label: "pending" },
  { value: "blocked", label: "blocked" },
];

const emptyValues = {
  name: "",
  surname: "",
  email: "",
  profession: "",
  salary: "",
  telephone: "",
} as SubscriberFormValues;

interface SubscriberFormProps {
  defaultValues?: SubscriberFormValues;
  submitLabel: string;
  onSubmit: (values: SubscriberFormValues) => Promise<void>;
  // e.g. back to the details - asks first when something was changed
  onCancel: () => void;
  // the edited subscriber may keep their own e-mail
  currentId?: string;
}

// the add / edit form in the subscriber panel: fields scroll, the buttons stay at the bottom
const SubscriberForm = ({
  defaultValues = emptyValues,
  submitLabel,
  onSubmit,
  onCancel,
  currentId,
}: SubscriberFormProps) => {
  // the list is usually cached already - used for the duplicate e-mail check
  const { data: subscribers } = useSubscribers();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SubscriberFormValues>({
    resolver: yupResolver(validationSubscriber),
    defaultValues,
  });

  const { blocker, whileSaving, discard } = useLeaveGuard(isDirty);

  const submit = handleSubmit(async (values) => {
    // the server checks it too - this answers at once, next to the field
    const owner = subscribers?.find(
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
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="grid gap-5 overflow-y-auto p-6">
        <p className="text-sm text-muted-foreground">All fields are required.</p>

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
          id="profession"
          label="Profession"
          registration={register("profession")}
          error={errors.profession?.message}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="salary"
            label="Salary"
            registration={register("salary")}
            error={errors.salary?.message}
          />
          <TextField
            id="telephone"
            label="Telephone (+44)"
            type="tel"
            autoComplete="tel-national"
            registration={register("telephone")}
            error={errors.telephone?.message}
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

      <DiscardChangesDialog blocker={blocker} onDiscard={discard} />
    </form>
  );
};

export default SubscriberForm;
