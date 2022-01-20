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
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  label: { color: "rgb(221, 220, 220) !important" },
  textField: {
    "& .MuiOutlinedInput-root": {
      color: "rgb(221, 220, 220)",
      marginBottom: 6,
      "& fieldset": {
        borderColor: "rgb(221, 220, 220)",
      },
      "&:hover fieldset": {
        borderColor: "rgb(221, 220, 220)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ffa500",
      },
    },
    "& .MuiIconButton-root": {
      color: "#ffa500",
    },
  },
  typography: { color: "crimson" },
});

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
      <InputLabel
        htmlFor="outlined-adornment-password"
        className={classes.label}
      >
        {name}
      </InputLabel>
      <OutlinedInput
        className={classes.root}
        {...register(name)}
        id="outlined-adornment-password"
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

export default PasswordInput;
