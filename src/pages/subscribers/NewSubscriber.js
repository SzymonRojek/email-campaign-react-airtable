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
  Divider,
} from "@mui/material";
import { Grid, Typography, Container } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import api from "../../api";
import { TextInputController } from "../../components/TextInputController";
import { StyledButton } from "../../components/StyledButton";
import { StyledHeading } from "../../components/StyledHeading";
import { capitalizeFirstLetter, validationSubscriber } from "../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white",
    },
    "&:hover .MuiInputLabel-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2e7d32",
    },
  },
}));

const style = {
  paper: {
    maxWidth: 600,
    margin: "auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "#fff" },
  name: { color: "green" },
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
  icon: { color: "orange", marginTop: 5 },
};

const styleTypography = { color: "crimson", paddingTop: 4 };

const AddSubscriber = ({
  isCalledRefSubscribers,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const classes = useStyles();
  const [isCheckboxChecked, setisCheckboxChecked] = useState(false);
  const [selectStatus, setSelectStatus] = useState(false);
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

  const handleCheckboxOnChange = () => setisCheckboxChecked(!isCheckboxChecked);

  const handleChangeSelectStatus = (event) =>
    setSelectStatus(event.target.value);

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
  console.log(selectStatus);
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

  console.log(errors);
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
                      <FormControl fullWidth className={classes.root}>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={selectStatus}
                          onChange={handleChangeSelectStatus}
                          autoWidth
                          label="status"
                          error={!!errors.status}
                          message={errors.status?.message ?? ""}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <Divider />
                          <MenuItem value="pending">Pending</MenuItem>
                          <Divider />
                          <MenuItem value="blocked">Blocked</MenuItem>
                        </Select>
                      </FormControl>
                      <p></p>
                      <Typography variant="inherit" style={styleTypography}>
                        {errors.status?.message ?? ""}
                      </Typography>
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
