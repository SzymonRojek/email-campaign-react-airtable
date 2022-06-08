import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  heading: {
    marginBottom: 50,
    fontSize: 30,
    color: "white",
    letterSpacing: 2,
    wordSpacing: 15,
    textAlign: "center",
    textTransform: "uppercase",
    [theme.breakpoints.up("md")]: {
      fontSize: 50,
    },
  },
}));
