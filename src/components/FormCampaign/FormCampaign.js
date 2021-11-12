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
        elevation={14}
        style={{
          maxWidth: 600,
          margin: "20px auto 40px auto",
          borderRadius: 8,
          backgroundColor: "#142F43",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={{ color: "#fff" }}
                >
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
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Grid item>
                  <StyledButton
                    onHover="#cf890a"
                    backgroundColor="#ffa500"
                    type="submit"
                    ariaLabel="draft"
                    label="draft"
                    onClick={() => {
                      setActionStatus("draft");
                      getCampaignsData();
                    }}
                  />
                </Grid>
                <Grid item>
                  <StyledButton
                    onHover="#286a2b"
                    backgroundColor="#2e7d32"
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
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FormCampaign;
