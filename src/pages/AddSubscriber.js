import { Paper, Button, Box, TextField, Typography } from "@mui/material";
import { Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink } from "react-router-dom";

import { validationSchema } from "./../helpers";

import api from "./../api";

const AddSubscriber = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const endpoint = "/subscribers";

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        status: ["pending"],
      },
    });
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
