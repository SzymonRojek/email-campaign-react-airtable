import { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "160px 10px 0 10px",
    [theme.breakpoints.up("md")]: {
      marginTop: 300,
    },
  },
}));

const StyledContainer = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();

  return <div className={classes.container}>{children}</div>;
};

export default StyledContainer;
