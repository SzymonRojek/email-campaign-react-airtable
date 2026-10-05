import { ReactNode } from "react";
import { FormControl, Checkbox, checkboxClasses } from "@mui/material";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from "react-hook-form";
import { Typography } from "@material-ui/core";

const styles = {
  mainContainer: { display: "flex", flexDirection: "column" },
  checkboxContainer: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
  },
  checkbox: {
    [`&, &.${checkboxClasses.checked}`]: {
      transform: "scale(1.1)",
      color: "orange",
    },
  },
  label: {
    fontSize: "1rem",
    color: "orange",
    paddingLeft: 8,
    letterSpacing: 1,
  },
  error: { color: "crimson", paddingTop: 4, letterSpacing: 1 },
} as const;

interface CheckboxInputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  defaultValue: boolean;
  label: ReactNode;
  error?: boolean;
  message?: string;
}

const CheckboxInputController = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  label,
  message,
}: CheckboxInputControllerProps<T>) => (
  <FormControl style={styles.mainContainer}>
    <div style={styles.checkboxContainer}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as UnpackNestedValue<PathValue<T, Path<T>>>}
        rules={{ required: true }}
        render={({ field: { ref, value, ...field } }) => (
          <Checkbox
            {...field}
            checked={!value ? defaultValue : Boolean(value)}
            inputRef={ref}
            sx={styles.checkbox}
            inputProps={{ "aria-label": String(name) }}
          />
        )}
      />

      <Typography variant="inherit" style={styles.label}>
        {label}
      </Typography>
    </div>

    <Typography variant="inherit" style={styles.error}>
      {message}
    </Typography>
  </FormControl>
);

export default CheckboxInputController;
