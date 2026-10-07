import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { normalizeText, validationSubscriber } from "helpers";
import { useSubscribers } from "customHooks/queries";
import TextField from "components/form/TextField";
import SelectField from "components/form/SelectField";
import { SelectOption, SubscriberFormValues } from "types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  // the edited subscriber may keep their own e-mail
  currentId?: string;
}

const SubscriberForm = ({
  defaultValues = emptyValues,
  submitLabel,
  onSubmit,
  currentId,
}: SubscriberFormProps) => {
  // the list is usually cached already - used for the duplicate e-mail check
  const { data: subscribers } = useSubscribers();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SubscriberFormValues>({
    resolver: yupResolver(validationSubscriber),
    defaultValues,
  });

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

    await onSubmit(values);
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        <form onSubmit={submit} noValidate className="grid gap-5">
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

          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              id="profession"
              label="Profession"
              registration={register("profession")}
              error={errors.profession?.message}
            />
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

          <Button
            type="submit"
            variant="brand"
            className="h-10 justify-self-end px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriberForm;
