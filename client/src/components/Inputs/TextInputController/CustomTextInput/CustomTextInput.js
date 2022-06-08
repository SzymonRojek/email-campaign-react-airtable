import PropTypes from "prop-types";
import { TextField } from "@mui/material";

import { inputLabelProps, useStyles } from "./styles";

const CustomTextInput = ({
  name,
  value,
  onChange,
  label,
  error,
  rows,
  multiline,
}) => {
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

CustomTextInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  rows: PropTypes.number,
  multiline: PropTypes.bool,
};

CustomTextInput.defaultProps = { rows: 5 };

export default CustomTextInput;
