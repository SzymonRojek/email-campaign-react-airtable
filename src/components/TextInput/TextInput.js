import PropTypes from "prop-types";
import { TextField, Typography } from "@mui/material";
import { Grid } from "@material-ui/core";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { withStyles } from "@mui/styles";

const inputLabelProps = {
  sx: {
    // set the color of the label when not shrinked
    color: "#fff",
    [`&.${inputLabelClasses.shrink}`]: {
      // set the color of the label when shrinked (usually when the TextField is focused)
      color: "#fff",
    },
  },
};

const styleTypography = { color: "crimson", paddingTop: 4 };

const StyledTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2e7d32",
      },
    },
  },
})(TextField);

const TextInput = ({ error, register, value, message, multiline, rows }) => (
  <Grid item xs={12}>
    <StyledTextField
      variant="outlined"
      multiline={multiline}
      rows={rows}
      required
      id={value}
      name={value}
      label={value}
      fullWidth
      margin="dense"
      {...register(value)}
      error={error}
      InputLabelProps={inputLabelProps}
    />
    <Typography variant="inherit" style={styleTypography}>
      {message}
    </Typography>
  </Grid>
);

TextInput.propTypes = {
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  message: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
};

TextInput.defaultProps = { message: "", rows: 5, errors: {} };

export default TextInput;
