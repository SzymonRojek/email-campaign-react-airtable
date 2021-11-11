import { Paper, Box, Container } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";

import { TextInput } from "../../components/TextInput";
import { StyledButton } from "../StyledButton";

const FormCampaign = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  setActionStatus,
  getCampaignsData,
}) => {
  return (
    <Container>
      <Paper
        elevation={6}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 8,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color="textSecondary" variant="body2">
                  *Fields required
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  value="title"
                  register={register}
                  error={!!errors?.title}
                  message={errors.title?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  multiline
                  rows={5}
                  value="description"
                  register={register}
                  error={!!errors?.description}
                  message={errors.description?.message ?? ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledButton
                  backgroundColor="#FFAB4C"
                  type="submit"
                  ariaLabel="draft"
                  label="draft"
                  onClick={() => {
                    setActionStatus("draft");
                    getCampaignsData();
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledButton
                  backgroundColor="#FF5F7E"
                  label="send"
                  ariaLabel="send"
                  type="submit"
                  onClick={() => {
                    setActionStatus("sent");
                    getCampaignsData();
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FormCampaign;
