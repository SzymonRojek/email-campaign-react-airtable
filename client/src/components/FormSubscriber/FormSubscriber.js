import PropTypes from "prop-types";
import { Paper, Box, Collapse, Button } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import {
  TextInputController,
  SelectInputController,
  CheckboxInputController,
} from "components/Inputs";

const selectStatusData = [
  { value: "select status", label: "select status*" },
  { value: "blocked", label: "blocked" },
  { value: "pending", label: "pending" },
  { value: "active", label: "active" },
];

const styles = {
  paper: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typographyRequiredText: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  icon: { color: "orange", fontSize: 30, marginTop: 6 },
};

const FormSubscriber = ({
  control,
  errors,
  handleSubmit,
  isCheckboxChecked,
}) => (
  <Paper elevation={14} style={styles.paper}>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography
            color="textSecondary"
            variant="body2"
            style={styles.typographyRequiredText}
          >
            *Fields required
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextInputController
            control={control}
            name="name"
            label="name"
            defaultValue=""
            error={!!errors.name}
            message={errors.name?.message ?? ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputController
            control={control}
            name="surname"
            label="surname"
            defaultValue=""
            error={!!errors.surname}
            message={errors.surname?.message ?? ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputController
            control={control}
            name="email"
            label="email"
            defaultValue=""
            error={!!errors.email}
            message={errors.email?.message ?? ""}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectInputController
            control={control}
            name="status"
            defaultValue="select status"
            error={!!errors.status}
            message={errors.status?.message ?? ""}
            data={selectStatusData}
            styles={styles.select}
          />
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={11}>
            <CheckboxInputController
              control={control}
              name="checkbox"
              defaultValue={false}
              error={!!errors.checkbox}
              message={errors.checkbox?.message ?? ""}
              label={
                isCheckboxChecked ? "Close more details" : "Open more details"
              }
            />
          </Grid>
          <Grid item xs={1}>
            {isCheckboxChecked ? (
              <ExpandLess style={styles.icon} />
            ) : (
              <ExpandMore style={styles.icon} />
            )}
          </Grid>
        </Grid>

        <Collapse in={isCheckboxChecked} timeout="auto" unmountOnExit>
          <Box px={2} py={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="profession"
                  label="profession"
                  defaultValue=""
                  error={!!errors.profession}
                  message={errors.profession?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="salary"
                  label="salary"
                  defaultValue=""
                  error={!!errors.salary}
                  message={errors.salary?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="telephone"
                  label="telephone +44"
                  defaultValue=""
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
            <Button label="submit" ariaLabel="add subscriber" type="submit" />
          </Grid>
        </Grid>
      </Grid>
    </form>
  </Paper>
);

FormSubscriber.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  isCheckboxChecked: PropTypes.bool,
};

export default FormSubscriber;
