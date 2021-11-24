import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Paper, Box } from "@mui/material";
import { Grid, Typography, Container } from "@material-ui/core";

import api from "../../api";
import { TextInput } from "../../components/TextInput";
import { StyledButton } from "../../components/StyledButton";
import { StyledHeading } from "../../components/StyledHeading";
import { capitalizeFirstLetter, validationSubscriber } from "../../helpers";

const style = {
  paper: {
    maxWidth: 600,
    margin: "auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "#fff" },
  name: { color: "green" },
};

const AddSubscriber = ({
  setOpenInfoPopup,
  setContentPopup,
  isCalledRefSubscribers,
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

    isCalledRefSubscribers.current = false;

    setContentPopup({
      title: "Yeah 🎊",
      text: (
        <>
          Subscriber
          <span style={style.name}>
            <strong> {capitalizeFirstLetter(data.name)} </strong>
          </span>
          has been added to the data 😁
        </>
      ),
      colorButton: "success",
    });

    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
    }, 3_000);
  };

  return (
    <Container>
      <StyledHeading label="Add Subscriber:" />

      <Paper elevation={14} style={style.paper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={style.typography}
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
                    bgc="#2e7d32"
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
    </Container>
  );
};

export default AddSubscriber;
