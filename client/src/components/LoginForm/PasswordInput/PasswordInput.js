import PropTypes from "prop-types";
import { useState } from "react";
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

const PasswordInput = ({ name, register, message }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
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
        className={classes.root}
        {...register(name)}
        id={`1-${name}`}
        type={values.showPassword ? "text" : "password"}
        value={values.password}
        onChange={handleChange("password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={name}
      />

      <Typography variant="inherit">{message}</Typography>
    </FormControl>
  );
};

PasswordInput.propTypes = {
  name: PropTypes.string,
  register: PropTypes.func,
  message: PropTypes.string,
};

export default PasswordInput;
