import { Paper, Button, Box } from "@mui/material";
import { Grid, Typography } from "@material-ui/core";

import { TextInput } from "../../components/TextInput";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const FormCampaign = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  setActionStatus,
  getCampaignsData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const backToCampaignList = () => {
    if (location.pathname === "/campaigns/recMG0MqjnfCdY0yG")
      navigate("/campaigns");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper
        elevation={6}
        style={{
          maxWidth: 500,
          marginTop: 100,
          textAlign: "center",
          borderRadius: 8,
          // backgroundColor: "#303f9f",
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
