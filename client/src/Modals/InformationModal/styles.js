import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  titleContainer: { display: "flex" },
  title: { flexGrow: 1 },
  infoText: { color: "green", fontSize: 16 },
};

export const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 500,
  },
  heading: { fontSize: 18 },
  contentText: { fontSize: 15 },
  smallButton: {
    "&.MuiButton-root": {
      height: 30,
      fontWeight: "bold",
      fontSize: 14,
    },
  },
  [theme.breakpoints.up("sm")]: {
    heading: { fontSize: 25 },
    contentText: { fontSize: 20 },
    smallButton: {
      "&.MuiButton-root": {
        height: 40,
        fontSize: 16,
      },
    },
  },
}));
