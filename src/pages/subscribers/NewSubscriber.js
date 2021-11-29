import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Paper,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  Collapse,
} from "@mui/material";
import { Grid, Typography, Container } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import api from "../../api";
import { TextInputController } from "../../components/TextInputController";
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
  labelCheckbox: { color: "orange" },
  checkbox: {
    color: "orange",
    "&.Mui-checked": {
      color: "orange",
    },
    paddingLeft: 3,
  },
  icon: { color: "orange" },
};

const AddSubscriber = ({
  isCalledRefSubscribers,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  // const defaultIds = [1];
  const [isCheckboxChecked, setisCheckboxChecked] = useState(false);
  const [selectStatus, setSelectStatus] = useState("");
  const endpoint = "/subscribers";
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSubscriber(isCheckboxChecked)),
    // defaultValues: { item_ids: defaultIds },
  });

  const handleCheckboxOnChange = () => setisCheckboxChecked(!isCheckboxChecked);

  const handleChangeSelectStatus = (event) =>
    setSelectStatus(event.target.value);

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({ name: "", surname: "", profession: "" });
  }, [formState, reset]);

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        name: data.name,
        surname: data.surname,
        profession: data.profession,
        status: isCheckboxChecked ? selectStatus : "pending",
        email: isCheckboxChecked ? data.email : "",
        salary: isCheckboxChecked ? String(data.salary) : "",
        telephone: isCheckboxChecked ? data.telephone : "",
        address: "",
      },
    });

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
                    style={style.labelCheckbox}
                    control={
                      <Checkbox
                        sx={style.checkbox}
                        defaultValue={false}
                        onChange={handleCheckboxOnChange}
                      />
                    }
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
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          Choose Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={selectStatus}
                          onChange={handleChangeSelectStatus}
                          autoWidth
                          label="status"
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="blocked">Blocked</MenuItem>
                        </Select>
                      </FormControl>
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
