import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationLogin } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { LogFormButton } from "components/LogFormButton";
import { PasswordInput } from "./PasswordInput";

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
};

const useStyles = makeStyles((theme) => ({
  logInButton: {
    "&.MuiButton-root": {
      maxWidth: 120,
      margin: "20px 0 20px 0",
      padding: "10px 20px",
      fontSize: 16,
      fontWeight: "bold",
      color: "#142f43",
      backgroundColor: "orange",
      textTransform: "uppercase",
      border: "none",
      borderRadius: 3,
      cursor: "pointer",
      transition: "all .3s ease",

      "&:hover": {
        backgroundColor: "#ca880e",
        color: "rgb(221, 220, 220)",
        transform: "translateY(-2px)",
      },

      "&:active": {
        transform: "translateY(2px)",
      },
    },
  },
}));

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
                  style={styles.typography}
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
                  style={styles.typography}
                >
                  - type admin
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
