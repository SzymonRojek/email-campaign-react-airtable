import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { Grid } from "@material-ui/core";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { withStyles } from "@mui/styles";

const inputLabelProps = {
  sx: {
    // set the color of the label when not shrinked
    color: "#fff",
    [`&.${inputLabelClasses.shrink}`]: {
      // set the color of the label when shrinked (usually when the TextField is focused)
      // color: "#ffa500 !important",
      letterSpacing: 1,
    },
  },
};

const StyledTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      color: "rgb(221, 220, 220)",
    },
    "& label.Mui-focused": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root": {
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
  },
})(TextField);

const CustomTextInput = ({
  name,
  value,
  onChange,
  label,
  error,
  rows,
  multiline,
}) => (
  <Grid item xs={12}>
    <StyledTextField
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
    />
  </Grid>
);

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
