import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Box, Collapse, Divider } from "@mui/material";
import { Grid, Typography, Container } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import api from "api";
import {
  TextInputController,
  SelectInputController,
  StyledCheckbox,
} from "components/Inputs";
import { StyledButton } from "components/StyledButton";
import { StyledHeading } from "components/StyledHeading";
import { capitalizeFirstLetter, validationSubscriber } from "helpers";

const selectStatusData = [
  { value: "change status", label: "change status*" },
  { value: "blocked", label: "blocked" },
  { value: "pending", label: "pending" },
  { value: "active", label: "active" },
];

const style = {
  paper: {
    maxWidth: 600,
    margin: "auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typographyRequiredText: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
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
};

const AddSubscriberPage = ({
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
        status: "change status",
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
                  style={style.typographyRequiredText}
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
                  <StyledCheckbox
                    sx={style.checkbox}
                    style={style.labelCheckbox}
                    defaultValue={false}
                    onChange={handleCheckboxOnChange}
                    label="Add More Details"
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
                        name="status"
                        error={!!errors.status}
                        message={errors.status?.message ?? ""}
                        defaultValue="change status"
                        data={selectStatusData}
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

AddSubscriberPage.propTypes = {
  isCalledRefSubscribers: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }),
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default AddSubscriberPage;
