import { TextField, Typography } from "@mui/material";
import { Grid } from "@material-ui/core";

const TextInput = ({ error, register, value, message }) => {
  return (
    <Grid item xs={12}>
      <TextField
        required
        id={value}
        name={value}
        label={value}
        fullWidth
        margin="dense"
        {...register(value)}
        error={error}
      />
      <Typography variant="inherit" color="textSecondary">
        {message}
      </Typography>
    </Grid>
  );
};

export default TextInput;
