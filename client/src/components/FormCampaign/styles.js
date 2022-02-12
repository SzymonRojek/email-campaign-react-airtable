import { checkboxClasses } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  sendButton: {
    "&.MuiButton-root": {
      margin: "20px 10px",
      padding: "10px 15px",
      minWidth: 150,
      color: "#142f43",
      fontWeight: "bold",
      letterSpacing: 1,

      "&:hover": {
        color: "rgb(221, 220, 220)",
      },

      [theme.breakpoints.down("sm")]: {
        minWidth: 120,
        padding: 10,
        fontSize: 12,
      },
    },
  },
  draftButton: {
    "&.MuiButton-root": {
      margin: "20px 10px",
      padding: "10px 15px",
      maxWidth: 150,
      color: "#142f43",
      fontWeight: "bold",
      letterSpacing: 1,
      backgroundColor: "orange",

      "&:hover": {
        backgroundColor: "#ca880e",
        color: "rgb(221, 220, 220)",
      },

      [theme.breakpoints.down("sm")]: {
        minWidth: 120,
        padding: 10,
        fontSize: 12,
      },
    },
  },
  label: {
    color: "orange",
    fontSize: 19,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
}));

export const styles = {
  paper: {
    maxWidth: 600,
    margin: "20px auto",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typography: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  checkbox: {
    [`&, &.${checkboxClasses.checked}`]: {
      transform: "scale(1.1)",
      color: "orange",
    },
  },
};
