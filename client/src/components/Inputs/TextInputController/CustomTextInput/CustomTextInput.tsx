import { ChangeEvent, Ref } from "react";
import { TextField } from "@mui/material";

import { inputLabelProps, useStyles } from "./styles";

export interface CustomTextInputProps {
  name: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  label?: string;
  error?: boolean;
  rows?: number;
  multiline?: boolean;
}

const CustomTextInput = ({
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  label,
  error,
  rows = 5,
  multiline,
}: CustomTextInputProps) => {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      id={name}
      name={name}
      label={label}
      value={value}
      error={error}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={inputRef}
      required
      fullWidth
      margin="dense"
      rows={rows}
      multiline={multiline}
      InputLabelProps={inputLabelProps}
      className={classes.root}
    />
  );
};

export default CustomTextInput;
