import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const styles = {
  textError: { color: "crimson", paddingTop: 10 },
};

const useSelectStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },

    "& .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiSvgIcon-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffa500",
    },
  },
});

const useMenuItemStyles = makeStyles((theme) => ({
  root: {
    "&.MuiMenuItem-root": {
      padding: 10,
      backgroundColor: "#22445f !important",
      borderBottom: "1px solid rgb(221, 220, 220) !important",
      color: "rgb(221, 220, 220) !important",
      display: "flex",
      justifyContent: "center",

      "&:hover": {
        color: "rgb(221, 220, 220)",
        backgroundColor: "#142f43 !important",
      },
    },
  },
}));

const SelectInputController = ({ ...props }) => {
  const { control, name, defaultValue, error, message, data } = props;

  const classesSelectStyles = useSelectStyles();
  const classesMenuItem = useMenuItemStyles();

  const customId = `${name}-id`;

  return (
    <FormControl fullWidth className={classesSelectStyles.root}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { ref, value, ...field } }) => (
          <Select
            {...field}
            inputRef={ref}
            id={customId}
            value={value}
            selected={value}
            error={error}
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

      <Typography variant="inherit" style={styles.textError}>
        {message}
      </Typography>
    </FormControl>
  );
};

SelectInputController.propTypes = {
  control: PropTypes.object,
  error: PropTypes.bool,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  message: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default SelectInputController;
