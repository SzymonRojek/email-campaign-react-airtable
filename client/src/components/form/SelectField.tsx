import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOption } from "types";

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
}

const SelectField = <T extends FieldValues>({
  control,
  name,
  id,
  label,
  placeholder,
  options,
  error,
}: SelectFieldProps<T>) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value ?? ""} onValueChange={field.onChange}>
          <SelectTrigger
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onBlur={field.onBlur}
            className="h-10 w-full"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);

export default SelectField;
