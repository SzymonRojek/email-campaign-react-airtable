import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "absolute",
    bottom: 0,
    minHeight: "5vh",
    color: "#ffffff8c",
    backgroundColor: "#142f43",
  },
  icon: {
    fontSize: 25,
    color: "orange",
    cursor: "pointer",
    zIndex: -1,
  },
  footer: { marginBottom: 180, zIndex: 1, textAlign: "center" },
  label: {
    [theme.breakpoints.up("sm")]: {
      fontSize: 20,
    },
  },
}));
