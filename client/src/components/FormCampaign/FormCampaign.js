import PropTypes from "prop-types";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { Paper, Grid, Typography } from "@material-ui/core";

import { useStyles, styles } from "./styles";
import { TextInputController } from "components/Inputs";
import ActiveSubscribersPopup from "../DisplayMessage/ActiveSubscribersPopup/ActiveSubscribersPopup";

const FormCampaign = ({ ...props }) => {
  const {
    control,
    errors,
    handleDraftData,
    handleSendData,
    disabledCheckbox,
    labelCheckbox,
  } = props;

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
                        onChange={handleIsChecked}
                        sx={styles.checkbox}
                        disabled={disabledCheckbox}
                      />
                    )}
                  />
                }
                label={<span className={classes.label}>{labelCheckbox}</span>}
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
