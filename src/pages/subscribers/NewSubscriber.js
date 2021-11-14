import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Paper, Box } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";

import api from "../../api";
import { TextInput } from "../../components/TextInput";
import { StyledButton } from "../../components/StyledButton";
import { capitalizeFirstLetter, validationSubscriber } from "../../helpers";

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
  } = useForm({
    resolver: yupResolver(validationSubscriber),
  });

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
      title: "Yeah 🎊",
      text: (
        <>
          Subscriber
          <span style={{ color: "green" }}>
            <strong> {capitalizeFirstLetter(data.name)} </strong>
          </span>
          has been added to the data 😁
        </>
      ),
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
          margin: "100px 0 60px 0",
          color: "#142F43",
          letterSpacing: 2,
          wordSpacing: 15,
        }}
      >
        Add Subscriber:
      </h1>
      <>
        <Paper
          elevation={14}
          style={{
            maxWidth: 600,
            margin: "100px auto",
            borderRadius: 8,
            backgroundColor: "#142F43",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box px={3} py={3}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{ color: "#fff" }}
                  >
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
                <Grid item xs={12}>
                  <TextInput
                    value="email"
                    register={register}
                    error={!!errors?.email}
                    message={errors.email?.message ?? ""}
                  />
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  <Grid item>
                    <StyledButton
                      hover="#286a2b"
                      backgroundcolor="#2e7d32"
                      label="submit"
                      ariaLabel="add"
                      type="submit"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Paper>
      </>
    </>
  );
};

export default AddSubscriber;
