import { TextField, Typography } from "@mui/material";
import { Grid } from "@material-ui/core";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { withStyles } from "@mui/styles";
import "./styles.css";

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
        borderColor: "green",
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
      InputLabelProps={{
        sx: {
          // set the color of the label when not shrinked
          color: "#fff",
          [`&.${inputLabelClasses.shrink}`]: {
            // set the color of the label when shrinked (usually when the TextField is focused)
            color: "#fff",
          },
        },
      }}
    />
    <Typography variant="inherit" style={{ color: "crimson", paddingTop: 4 }}>
      {message}
    </Typography>
  </Grid>
);

export default TextInput;
