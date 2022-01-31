import { Paper, Box, Collapse } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import {
  TextInputController,
  SelectInputController,
  StyledCheckbox,
} from "components/Inputs";
import { StyledButton } from "components/StyledButton";

const useStyles = makeStyles({
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
      borderColor: "#ffa500",
    },
  },
});

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
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typographyRequiredText: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  icon: { color: "orange", fontSize: 30, marginTop: 6 },
  select: {
    textError: { color: "crimson", paddingTop: 10 },
    menuItem: {
      borderBottom: "1px solid #ddd",
    },
  },
};

const FormSubscriber = ({
  control,
  errors,
  handleSubmit,
  isCheckboxChecked,
}) => (
  <Paper elevation={14} style={styles.paper}>
    <form onSubmit={handleSubmit}>
      <Box px={3} py={3}>
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
              name="email"
              error={!!errors.email}
              message={errors.email?.message ?? ""}
            />
          </Grid>
          <Grid item xs={12}>
            <SelectInputController
              control={control}
              name="status"
              error={!!errors.status}
              message={errors.status?.message ?? ""}
              defaultValue="select status"
              data={selectStatusData}
              styles={styles.select}
              useStyles={useStyles}
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={11}>
              <StyledCheckbox
                control={control}
                name="checkbox"
                error={!!errors.checkbox}
                message={errors.checkbox?.message ?? ""}
                defaultValue={false}
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
                    error={!!errors.profession}
                    message={errors.profession?.message ?? ""}
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
                ariaLabel="add subscriber"
                type="submit"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  </Paper>
);

export default FormSubscriber;
