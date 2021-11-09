import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Paper, Box, Container } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";

import api from "../../api";
import { TextInput } from "../../components/TextInput";
import { StyledButton } from "../../components/StyledButton";
import { capitalizeFirstLetter, validationSchema } from "../../helpers";

const AddSubscriber = ({
  setOpenInfoPopup,
  setContentPopup,
  getSubscribersData,
}) => {
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
      text: `Subscriber ${capitalizeFirstLetter(
        data.name
      )} has been added to the data :D`,
      colorButton: "success",
    });

    getSubscribersData();
    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
    }, 3_000);
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginBottom: -40,
          color: "#003049",
          letterSpacing: 2,
        }}
      >
        Add New Subscriber:
      </h1>
      <Container>
        <Paper
          elevation={6}
          style={{
            maxWidth: 600,
            margin: "100px auto",
            borderRadius: 8,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box px={3} py={3}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="body2">
                    *Fields required
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    value="name"
                    register={register}
                    error={!!errors?.name}
                    message={errors.name?.message ?? ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    value="surname"
                    register={register}
                    error={!!errors?.surname}
                    message={errors.surname?.message ?? ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    value="profession"
                    register={register}
                    error={!!errors?.profession}
                    message={errors.profession?.message ?? ""}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <StyledButton label="add" ariaLabel="add" type="submit" />
                </Grid>
              </Grid>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddSubscriber;
