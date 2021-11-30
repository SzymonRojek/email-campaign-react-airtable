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
      color: "#fff",
    },
  },
};

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

const CustomTextInput = ({ name, error, value, onChange, rows, multiline }) => (
  <Grid item xs={12}>
    <StyledTextField
      variant="outlined"
      id={name}
      name={name}
      label={name}
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

// TextInput.propTypes = {
//   errors: PropTypes.object,
//   register: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired,
//   message: PropTypes.string,
//   multiline: PropTypes.bool,
//   rows: PropTypes.number,
// };

// TextInput.defaultProps = { rows: 5 };

export default CustomTextInput;
