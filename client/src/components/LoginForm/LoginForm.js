import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TextInputController } from "../Inputs";
import { LogFormButton } from "../LogFormButton";
import validationLogin from "../../helpers/validationLogin";

const useStyles = makeStyles(() => ({
  paper: {
    maxWidth: 600,
    margin: "120px auto",
    borderRadius: 8,
    backgroundColor: "#142F43",

    "@media (min-width:960px)": {
      marginTop: 240,
    },
  },
}));

const style = {
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  heading: {
    color: "orange",
    textAlign: "center",
    letterSpacing: 2,
    wordSpacing: 3,
  },
};

const LoginForm = ({ setLoginValue }) => {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationLogin),
  });

  const onSubmit = (data) => {
    if (data.password === data.confirmPassword) {
      setLoginValue(true);
    }
  };

  return (
    <Paper elevation={14} className={classes.paper}>
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
              <h1 color="textSecondary" variant="h1" style={style.heading}>
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
              <LogFormButton label="log in" style={{ margin: "50px auto" }} />
            </Grid>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;
