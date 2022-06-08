import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  paper: {
    maxWidth: 600,
    margin: "0 auto",
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  textInfo: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  textPassword: {
    color: "orange",
    letterSpacing: 1,
    wordSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  heading: {
    color: "orange",
    textAlign: "center",
    letterSpacing: 2,
    wordSpacing: 3,
  },
};

export const useStyles = makeStyles((theme) => ({
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
