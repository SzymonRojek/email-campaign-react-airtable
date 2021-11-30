import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
  Collapse,
} from "@mui/material";
import { Grid, Typography, Container } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import api from "../../api";
import { TextInputController } from "../../components/TextInputController";
import { SelectInputController } from "../../components/SelectInputController";
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
  titlePopup: { color: "green", fontWeight: "bold" },
  subscriberName: { color: "green" },
  labelCheckbox: {
    fontSize: "1rem",
    color: "orange",
    paddingLeft: 8,
    letterSpacing: 1,
  },
  checkbox: {
    transform: "scale(1.1)",
    color: "orange",
    "&.Mui-checked": {
      color: "orange",
    },
  },
  icon: { color: "orange", fontSize: 30, marginTop: 6 },
  textError: { color: "crimson", paddingTop: 4 },
};

const AddSubscriber = ({
  isCalledRefSubscribers,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const [isCheckboxChecked, setCheckboxState] = useState(false);
  const endpoint = "/subscribers";

  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSubscriber(isCheckboxChecked)),
  });

  const handleCheckboxOnChange = () => setCheckboxState(!isCheckboxChecked);

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        name: "",
        surname: "",
        profession: "",
        status: "",
        email: "",
        salary: "",
        telephone: "",
      });
  }, [formState, reset]);

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        name: data.name,
        surname: data.surname,
        profession: data.profession,
        status: isCheckboxChecked ? data.status : "pending",
        email: isCheckboxChecked ? data.email : "",
        salary: isCheckboxChecked ? String(data.salary) : "",
        telephone: isCheckboxChecked ? data.telephone : "",
      },
    });

    isCalledRefSubscribers.current = false;

    setContentPopup({
      title: <span style={style.titlePopup}>That's great 🎊</span>,
      text: (
        <>
          Subscriber
          <span style={style.subscriberName}>
            <strong> {capitalizeFirstLetter(data.name)} </strong>
          </span>
          has been added to the Airtable 😁
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
                <TextInputController
                  control={control}
                  name="name"
                  error={!!errors.name}
                  message={errors.name?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="surname"
                  error={!!errors.surname}
                  message={errors.surname?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="profession"
                  error={!!errors.profession}
                  message={errors.profession?.message ?? ""}
                />
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={11}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={style.checkbox}
                        defaultValue={false}
                        onChange={handleCheckboxOnChange}
                      />
                    }
                    label={
                      <span style={style.labelCheckbox}>Add More Details</span>
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  {isCheckboxChecked ? (
                    <ExpandLess style={style.icon} />
                  ) : (
                    <ExpandMore style={style.icon} />
                  )}
                </Grid>
              </Grid>

              <Collapse in={isCheckboxChecked} timeout="auto" unmountOnExit>
                <Box px={2} py={3}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <SelectInputController
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputController
                        control={control}
                        name="email"
                        error={!!errors.email}
                        message={errors.email?.message ?? ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputController
                        control={control}
                        name="salary"
                        error={!!errors.salary}
                        message={errors.salary?.message ?? ""}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputController
                        control={control}
                        name="telephone"
                        error={!!errors.telephone}
                        message={errors.telephone?.message ?? ""}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

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

AddSubscriber.propTypes = {
  isCalledRefSubscribers: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }),
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default AddSubscriber;
