import { ChangeEvent, MouseEvent, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Typography } from "@material-ui/core";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import clsx from "clsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useStyles } from "./styles";
import { LoginFormValues } from "types";

interface PasswordInputProps {
  name: keyof LoginFormValues;
  register: UseFormRegister<LoginFormValues>;
  error?: boolean;
  message?: string;
}

const PasswordInput = ({ name, register, message }: PasswordInputProps) => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { onChange, ref, ...registerProps } = register(name);

  // keep the visible value and react-hook-form in sync
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    onChange(event);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={clsx(classes.typography, classes.textField)}
    >
      <InputLabel htmlFor={`1-${name}`} className={classes.label}>
        {`${name}*`}
      </InputLabel>
      <OutlinedInput
        {...registerProps}
        inputRef={ref}
        id={`1-${name}`}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={name}
      />

      <Typography variant="inherit">{message}</Typography>
    </FormControl>
  );
};

export default PasswordInput;
