import PropTypes from "prop-types";
import { FormControl, Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";
import { Typography } from "@material-ui/core";

const styles = {
  mainContainer: { display: "flex", flexDirection: "column" },
  checkboxContainer: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
  },
  checkbox: {
    transform: "scale(1.1)",
    color: "orange",
    "&.Mui-checked": {
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
};

const CheckboxInputController = ({
  control,
  name,
  defaultValue,
  label,
  error,
  message,
}) => (
  <FormControl style={styles.mainContainer}>
    <div style={styles.checkboxContainer}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{ required: true }}
        error={error}
        render={({ field: { ref, value, ...field } }) => (
          <Checkbox
            {...field}
            checked={!value ? defaultValue : value}
            inputRef={ref}
            sx={styles.checkbox}
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

CheckboxInputController.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  defaultValue: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.bool,
  message: PropTypes.string,
};
export default CheckboxInputController;
