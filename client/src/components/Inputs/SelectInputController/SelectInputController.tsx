import { CSSProperties } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from "react-hook-form";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Typography } from "@material-ui/core";

import { useMenuItemStyles } from "./styles";
import { SelectOption } from "types";

interface SelectInputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  defaultValue?: string;
  error?: boolean;
  message?: string;
  data: SelectOption[];
  classesSelectStyles?: string;
  styles?: CSSProperties;
}

const SelectInputController = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  error,
  message,
  data,
  classesSelectStyles,
  styles,
}: SelectInputControllerProps<T>) => {
  const classesMenuItem = useMenuItemStyles();

  const customId = `${name}-id`;

  return (
    <FormControl fullWidth className={classesSelectStyles}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as UnpackNestedValue<PathValue<T, Path<T>>>}
        render={({ field: { ref, value, ...field } }) => (
          <Select
            {...field}
            inputRef={ref}
            id={customId}
            value={value as string}
            error={error}
            className={classesSelectStyles}
          >
            {data.map(({ value, label }) => (
              <MenuItem
                key={`key-${label}`}
                value={value}
                className={classesMenuItem.root}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Typography variant="inherit" style={styles}>
        {message}
      </Typography>
    </FormControl>
  );
};

export default SelectInputController;
