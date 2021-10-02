import { TextField, Typography } from "@mui/material";
import { Grid } from "@material-ui/core";

const TextInput = ({ errors, register, value }) => (
  <Grid item xs={12}>
    <TextField
      required
      id={value}
      name={value}
      label={value}
      fullWidth
      margin="dense"
      error={!!errors?.value}
      {...register(value)}
    />

    <Typography variant="inherit" color="textSecondary">
      {errors.value?.message ?? ""}
    </Typography>
  </Grid>
);

export default TextInput;
