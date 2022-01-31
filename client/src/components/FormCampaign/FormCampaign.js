import PropTypes from "prop-types";
import { Paper, Box, Grid, Typography } from "@material-ui/core";

import { TextInputController } from "components/Inputs";
import { StyledButton } from "components/StyledButton";

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
  control,
  errors,
  handleSubmit,
  handleDraftData,
  handleSendData,
}) => (
  <Paper elevation={14} style={style.paper}>
    <form>
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
              label="title"
              error={!!errors.title}
              message={errors.title?.message ?? ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputController
              control={control}
              name="description"
              label="description"
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
                label="draft"
                ariaLabel="draft"
                type="submit"
                onClick={handleSubmit(handleDraftData)}
              />
            </Grid>
            <Grid item>
              <StyledButton
                hover="#286a2b"
                bgc="#2e7d32"
                label="send"
                ariaLabel="send"
                type="submit"
                onClick={handleSubmit(handleSendData)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  </Paper>
);

FormCampaign.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleDraftData: PropTypes.func,
  handleSendData: PropTypes.func,
};

export default FormCampaign;
