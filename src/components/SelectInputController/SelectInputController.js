import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import { FormControl, Select, MenuItem, Divider } from "@mui/material";
import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

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

const SelectInputController = ({ control, errors }) => {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.root}>
      <Controller
        render={({ field: { ref, ...field } }) => (
          <Select
            {...field}
            inputRef={ref}
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            error={!!errors.status}
          >
            <MenuItem value="change status">
              <em>Change Status</em>
            </MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <Divider />
            <MenuItem value="pending">Pending</MenuItem>
            <Divider />
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        )}
        control={control}
        name="status"
        defaultValue="change status"
      />

      <Typography variant="inherit" style={style.textError}>
        {errors.status?.message ?? ""}
      </Typography>
    </FormControl>
  );
};

export default SelectInputController;
