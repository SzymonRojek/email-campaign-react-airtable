import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import { FormControl, Select, MenuItem, Divider } from "@mui/material";
import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { object } from "yup/lib/locale";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white",
    },
    "&:hover .MuiInputLabel-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2e7d32",
    },
  },
});

const style = {
  textError: { color: "crimson", paddingTop: 4 },
};

const SelectInputController = ({
  control,
  name,
  error,
  message,
  defaultValue,
  data,
}) => {
  const classes = useStyles();

  const customId = `${name}-id`;
  return (
    <FormControl fullWidth className={classes.root}>
      <Controller
        render={({ field: { ref, ...field } }) => (
          <Select {...field} inputRef={ref} id={customId} error={error}>
            {data.map(({ value, label }) => (
              <MenuItem key={`key-${label}`} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
        control={control}
        name={name}
        defaultValue={defaultValue}
      />

      <Typography variant="inherit" style={style.textError}>
        {message}
      </Typography>
    </FormControl>
  );
};

SelectInputController.propTypes = {
  control: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
export default SelectInputController;
