import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Button, Box } from "@mui/material";
import { Grid } from "@material-ui/core";

import api from "./../api";
import { TextInput } from "./../components/TextInput";
import { validationSchema } from "./../helpers";

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
        status: "pending",
      },
    });

    reset();
  };

  return (
    <Paper elevation={6}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={3} py={4}>
          <Grid container spacing={1}>
            <TextInput
              value="name"
              register={register}
              error={!!errors?.name}
              message={errors.name?.message ?? ""}
            />

            <TextInput
              value="surname"
              register={register}
              error={!!errors?.surname}
              message={errors.surname?.message ?? ""}
            />

            <TextInput
              value="email"
              register={register}
              error={!!errors?.email}
              message={errors.email?.message ?? ""}
            />
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
