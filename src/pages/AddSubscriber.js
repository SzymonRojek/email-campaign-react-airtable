import { Paper, Button, Box, TextField } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { TextInput } from "../components/TextInput";
import { Grid } from "@material-ui/core";
import { Typography } from "@mui/material";

const AddSubscriber = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <Paper elevation={6}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={3} py={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                margin="dense"
                error={!!errors?.name}
                {...register("name")}
              />

              <Typography variant="inherit" color="textSecondary">
                {errors.name?.message ?? ""}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="surname"
                surname="surname"
                label="Surname"
                fullWidth
                margin="dense"
                error={!!errors?.surname}
                {...register("surname")}
              />

              <Typography variant="inherit" color="textSecondary">
                {errors.surname?.message ?? ""}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="email"
                email="email"
                label="Email"
                fullWidth
                margin="dense"
                // type="email"
                error={!!errors?.email}
                {...register("email")}
              />

              <Typography variant="inherit" color="textSecondary">
                {errors.email?.message ?? ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Button variant="contained" color="primary" type="submit">
            Add Subscriber
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddSubscriber;
