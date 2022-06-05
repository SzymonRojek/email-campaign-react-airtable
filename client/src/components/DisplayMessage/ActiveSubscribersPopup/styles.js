import { checkboxClasses } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: 20,
  },
  checkbox: {
    [`&, &.${checkboxClasses.checked}`]: {
      transform: "scale(1.1)",
      color: "orange",
    },
  },
};

export const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 20,
    fontWeight: 600,
    textTransform: "uppercase",
    color: "green",
  },
  textInformation: {
    fontSize: 16,
  },
  mainButton: {
    "&.MuiButton-root": {
      marginBottom: 20,
      padding: "8px",
      minWidth: 180,
      fontSize: 16,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  },
  smallButton: {
    "&.MuiButton-root": { fontWeight: "bold", fontSize: 16 },
  },
  [theme.breakpoints.up("sm")]: {
    heading: { fontSize: 30 },
    textInformation: {
      fontSize: 20,
    },
    mainButton: {
      "&.MuiButton-root": {
        marginBottom: 40,
        padding: 15,
        fontSize: 18,
      },
    },
  },
}));
