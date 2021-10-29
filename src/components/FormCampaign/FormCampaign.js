import { Paper, Button, Box } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";
// import { Container } from "@material-ui/core";

import { TextInput } from "../../components/TextInput";

const FormCampaign = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  setActionStatus,
  getCampaignsData,
}) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper
        elevation={6}
        style={{
          maxWidth: 500,
          margin: "100px 20px 20px 20px",
          textAlign: "center",
          borderRadius: 8,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={4}>
            <Grid container spacing={1}>
              <Typography color="textSecondary" variant="body2">
                *Field required
              </Typography>

              <TextInput
                value="title"
                register={register}
                error={!!errors?.title}
                message={errors.title?.message ?? ""}
              />

              <TextInput
                multiline
                rows={5}
                value="description"
                register={register}
                error={!!errors?.description}
                message={errors.description?.message ?? ""}
              />
            </Grid>
          </Box>

          <Box mt={3}>
            <Button
              aria-label="sent"
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                setActionStatus("sent");
                getCampaignsData();
              }}
            >
              Send
            </Button>
          </Box>
          <Box mt={3}>
            <Button
              aria-label="draft"
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                setActionStatus("draft");
                getCampaignsData();
              }}
            >
              Draft
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FormCampaign;

// maybe add container instead of the box
