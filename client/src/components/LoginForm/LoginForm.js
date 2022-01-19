import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Box, Grid, Typography } from "@material-ui/core";

import { TextInputController } from "../Inputs";
import { LogFormButton } from "../LogFormButton";
import validationLogin from "../../helpers/validationLogin";
import { StyledContainer } from "../StyledContainer";

const styles = {
  paper: {
    maxWidth: 600,
    margin: "0 auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  heading: {
    color: "orange",
    textAlign: "center",
    letterSpacing: 2,
    wordSpacing: 3,
  },
  logFormButton: { margin: "50px auto" },
};

const LoginForm = ({ setIsLogIn }) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationLogin),
  });

  const onSubmit = (data) => {
    if (data.password === data.confirmPassword) {
      setIsLogIn(true);
    }
  };

  const handleHomeRoute = () => navigate("/");

  return (
    <StyledContainer>
      <Paper elevation={14} style={styles.paper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={styles.typography}
                >
                  *Fields required - type "admin"
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h1 color="textSecondary" variant="h1" style={styles.heading}>
                  Email Campaign
                </h1>
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="password"
                  error={!!errors.password}
                  message={errors.password?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInputController
                  control={control}
                  name="confirmPassword"
                  error={!!errors.confirmPassword}
                  message={errors.confirmPassword?.message ?? ""}
                />
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <LogFormButton
                  aria-label="log in button"
                  label="log in"
                  style={styles.logFormButton}
                  onClick={handleHomeRoute}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default LoginForm;
