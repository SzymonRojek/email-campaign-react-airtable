import PropTypes from "prop-types";
import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { Paper, Box, Grid, Typography } from "@material-ui/core";

import { TextInputController } from "components/Inputs";
import ActiveSubscribersPopup from "../DisplayMessage/ActiveSubscribersPopup/ActiveSubscribersPopup";
import { Controller } from "react-hook-form";
import { useState } from "react";

const styles = {
  paper: {
    maxWidth: 600,
    margin: "20px auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  checkbox: {
    transform: "scale(1.1)",
    color: "orange",
    "&.Mui-checked": {
      color: "orange",
    },
  },
  label: {
    color: "orange",
  },
};

const FormCampaign = ({ control, errors, handleDraftData, handleSendData }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleIsChecked = () => setIsChecked(!isChecked);

  return (
    <>
      <Paper elevation={14} style={styles.paper}>
        <form>
          <Box px={3} py={3}>
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
                  label="select from active subscribers"
                />
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    aria-label="draft"
                    // className={classes.button}
                    variant="contained"
                    color="error"
                    // onClick={() => closeActiveSubscribersPopup()}
                    onClick={handleDraftData}
                  >
                    <span>draft</span>
                  </Button>
                  {/* <StyledButton
                hover="#cf890a"
                bgc="#ffa500"
                label="draft"
                ariaLabel="draft"
                type="submit"
                onClick={handleDraftData}
              /> */}
                </Grid>
                <Grid item>
                  <Button
                    aria-label="send"
                    // className={classes.button}
                    variant="contained"
                    color="success"
                    onClick={handleSendData}
                  >
                    <span>send</span>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
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
