import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const MyMenuItem = withStyles({
  root: {
    backgroundColor: "#22445f !important",
    borderBottom: "1px solid rgb(221, 220, 220) !important",
    color: "rgb(221, 220, 220) !important",

    "&:hover": {
      color: "rgb(221, 220, 220)",
      backgroundColor: "#142f43 !important",
    },
  },
})(MenuItem);

const SelectInputController = ({ ...props }) => {
  const {
    control,
    name,
    error,
    message,
    defaultValue,
    data,
    useStyles,
    styles,
  } = props;

  const classes = useStyles();
  const customId = `${name}-id`;

  return (
    <FormControl fullWidth className={classes.root}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { ref, value, ...field } }) => (
          <Select
            {...field}
            inputRef={ref}
            id={customId}
            error={error}
            selected={value}
            value={value}
          >
            {data.map(({ value, label }) => (
              <MyMenuItem key={`key-${label}`} value={value}>
                {label}
              </MyMenuItem>
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
