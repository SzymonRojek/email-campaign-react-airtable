import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Button, Box } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";

import api from "../api";
import { TextInput } from "../components/TextInput";
import { capitalizeFirstLetter, validationSchema } from "../helpers";

const AddSubscriber = ({ setOpenInfoPopup, setContentPopup, getData }) => {
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
        profession: data.profession,
        email: data.email,
        status: "pending",
      },
    });

    reset();
    setContentPopup({
      title: "Done!",
      text: `Subscriber ${capitalizeFirstLetter(
        data.name
      )} has been added to the data :D`,
    });

    getData();
    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
    }, 3_000);
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper
          elevation={6}
          style={{
            maxWidth: 500,
            marginTop: 100,
            textAlign: "center",
            borderRadius: 8,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box px={3} py={4}>
              <Grid container spacing={1}>
                <Typography color="textSecondary" variant="body2">
                  *Field required
                </Typography>

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
                  value="profession"
                  register={register}
                  error={!!errors?.profession}
                  message={errors.profession?.message ?? ""}
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
      </Box>
    </>
  );
};

export default AddSubscriber;
