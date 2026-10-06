import { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  autoComplete?: string;
}

const TextField = ({
  id,
  label,
  registration,
  error,
  type = "text",
  autoComplete,
}: TextFieldProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className="h-10"
      {...registration}
    />
    {error && (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);

export default TextField;
