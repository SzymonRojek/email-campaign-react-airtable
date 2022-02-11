import PropTypes from "prop-types";
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  FormControlLabel,
  Checkbox,
  checkboxClasses,
} from "@mui/material";
import { Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TextInputController } from "components/Inputs";
import ActiveSubscribersPopup from "../DisplayMessage/ActiveSubscribersPopup/ActiveSubscribersPopup";

const useStyles = makeStyles((theme) => ({
  sendButton: {
    "&.MuiButton-root": {
      margin: 20,
      padding: "17px 15px",
      minWidth: 150,
      color: "#142f43",
      fontSize: 16,
      fontWeight: "bold",
      letterSpacing: 1,

      "&:hover": {
        color: "#FFF",
      },

      [theme.breakpoints.down("sm")]: {
        minWidth: 120,
        padding: "12px 10px",
        fontSize: 12,
      },
    },
  },
  draftButton: {
    "&.MuiButton-root": {
      margin: 10,
      padding: "17px 15px",
      maxWidth: 150,
      color: "#142f43",
      fontSize: 16,
      fontWeight: "bold",
      letterSpacing: 1,
      backgroundColor: "orange",

      "&:hover": {
        backgroundColor: "#ca880e",
        color: "#FFF",
      },

      [theme.breakpoints.down("sm")]: {
        minWidth: 120,
        padding: "12px 10px",
        fontSize: 12,
      },
    },
  },
  label: {
    color: "orange",
    fontSize: 19,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
}));

const styles = {
  paper: {
    maxWidth: 600,
    margin: "20px auto",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  checkbox: {
    [`&, &.${checkboxClasses.checked}`]: {
      transform: "scale(1.1)",
      color: "orange",
    },
  },
};

const FormCampaign = ({ control, errors, handleDraftData, handleSendData }) => {
  const [isChecked, setIsChecked] = useState(false);

  const classes = useStyles();

  const handleIsChecked = () => setIsChecked(!isChecked);

  return (
    <>
      <Paper elevation={14} style={styles.paper}>
        <form>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                color="textSecondary"
                variant="body2"
                style={styles.typography}
              >
                *Fields required
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextInputController
                control={control}
                name="title"
                label="title"
                defaultValue=""
                error={!!errors.title}
                message={errors.title?.message ?? ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInputController
                control={control}
                name="description"
                label="description"
                defaultValue=""
                multiline
                rows={5}
                error={!!errors.description}
                message={errors.description?.message ?? ""}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                sx={styles.label}
                control={
                  <Controller
                    name="active-subscribers"
                    control={control}
                    render={() => (
                      <Checkbox
                        defaultValue={false}
                        checked={isChecked}
                        onChange={() => handleIsChecked()}
                        sx={styles.checkbox}
                      />
                    )}
                  />
                }
                label={
                  <span className={classes.label}>
                    select from active subscribers
                  </span>
                }
              />
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button
                  aria-label="draft"
                  variant="contained"
                  onClick={handleDraftData}
                  className={classes.draftButton}
                >
                  draft email
                </Button>
              </Grid>

              <Grid item>
                <Button
                  aria-label="send"
                  variant="contained"
                  color="success"
                  onClick={handleSendData}
                  className={classes.sendButton}
                >
                  send email
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <ActiveSubscribersPopup
        openListActiveSubscribers={isChecked}
        closeListActiveSusbcribers={setIsChecked}
      />
    </>
  );
};
FormCampaign.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleDraftData: PropTypes.func,
  handleSendData: PropTypes.func,
};

export default FormCampaign;
