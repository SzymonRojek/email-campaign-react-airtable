import { Typography, TextField, Box } from "@mui/material";
import { Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

const TextInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box px={3} py={4}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                id="name"
                name="name"
                label="name"
                fullWidth
                margin="dense"
                error={!!errors.name}
              />
            )}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.name?.message ?? ""}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TextInput;
