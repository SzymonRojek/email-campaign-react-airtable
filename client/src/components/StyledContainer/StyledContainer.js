import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "160px 10px 0 10px",
    [theme.breakpoints.up("md")]: {
      marginTop: 280,
    },
  },
}));

const StyledContainer = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.container}>{children}</div>;
};

export default StyledContainer;
