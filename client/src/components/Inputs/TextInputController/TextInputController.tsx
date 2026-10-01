import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from "react-hook-form";
import { Typography } from "@mui/material";

import CustomTextInput from "./CustomTextInput";

const stylesError = { color: "crimson", paddingTop: 4 } as const;

interface TextInputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  defaultValue?: string;
  error?: boolean;
  message?: string;
  rows?: number;
  multiline?: boolean;
}

const TextInputController = <T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  error,
  message,
  rows = 5,
  multiline,
}: TextInputControllerProps<T>) => (
  <>
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      defaultValue={defaultValue as UnpackNestedValue<PathValue<T, Path<T>>>}
      render={({ field: { ref, value, ...field } }) => (
        <CustomTextInput
          {...field}
          value={value as string | undefined}
          inputRef={ref}
          label={label}
          error={error}
          rows={rows}
          multiline={multiline}
        />
      )}
    />

    <Typography variant="inherit" style={stylesError}>
      {message}
    </Typography>
  </>
);

export default TextInputController;
