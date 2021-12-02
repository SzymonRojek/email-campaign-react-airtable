import PropTypes from "prop-types";
import { Paper, Box, Grid, Typography } from "@material-ui/core";

import { TextInputController } from "../Inputs";
import { StyledButton } from "../StyledButton";

const style = {
  paper: {
    maxWidth: 600,
    margin: "20px auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
};

const FormCampaign = ({
  handleSubmit,
  onSubmit,
  control,
  errors,
  setCampaignStatus,
}) => (
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
              name="title"
              error={!!errors.title}
              message={errors.title?.message ?? ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputController
              control={control}
              name="description"
              multiline
              rows={5}
              error={!!errors.description}
              message={errors.description?.message ?? ""}
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
                hover="#cf890a"
                bgc="#ffa500"
                type="submit"
                ariaLabel="draft"
                label="draft"
                onClick={() => setCampaignStatus(false)}
              />
            </Grid>
            <Grid item>
              <StyledButton
                hover="#286a2b"
                bgc="#2e7d32"
                label="send"
                ariaLabel="send"
                type="submit"
                onClick={() => setCampaignStatus(true)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  </Paper>
);

FormCampaign.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setCampaignStatus: PropTypes.func.isRequired,
};

export default FormCampaign;
