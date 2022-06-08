import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Box, Grid, Typography } from "@material-ui/core";

import { styles, useStyles } from "./styles";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationLogin } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { LogFormButton } from "components/LogFormButton";
import { PasswordInput } from "./PasswordInput";

const LoginForm = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { setIsLogIn, setTabsValue } = useGlobalStoreContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationLogin),
  });

  const onSubmit = (data) => {
    if (data.password === data.confirmPassword) {
      setIsLogIn(true);
    }
  };

  const handleHomeRoute = () => {
    setTabsValue(2);
    navigate("/");
  };

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
                  style={styles.textInfo}
                >
                  *Fields required
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <h1 style={styles.heading}>Email Campaign</h1>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  style={styles.textPassword}
                >
                  - Password: type admin
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <PasswordInput
                  name="password"
                  register={register}
                  error={!!errors.password}
                  message={errors.password?.message ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordInput
                  name="confirmPassword"
                  register={register}
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
                  type="button"
                  className={classes.logInButton}
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
