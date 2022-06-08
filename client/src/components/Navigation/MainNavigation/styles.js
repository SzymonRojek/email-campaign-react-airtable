import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  tabsRoot: {
    height: 3,
  },
  container: {
    position: "fixed",
    display: "grid",
    gridTemplateColumns: "120px 1fr 120px",
    top: 0,
    minHeight: "5vh",
    width: "100%",
    backgroundColor: "#142f43",
    padding: "20px 50px",
    boxShadow: "0 4px 2px -2px rgba(0, 0, 0, .2)",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  logoContainer: {
    [theme.breakpoints.up("md")]: {
      width: 50,
      height: 50,
    },
    [theme.breakpoints.down("sm")]: {
      width: 40,
      height: 40,
      marginBottom: 8,
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: 18,
    letterSpacing: 2,
    "&:first-child": {
      marginLeft: theme.spacing(7),
      marginRight: theme.spacing(7),
    },
    "&:last-child": {
      padding: "0 40px",
    },
  },
  logOutButton: {
    "&.MuiButton-root": {
      maxWidth: 120,
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
