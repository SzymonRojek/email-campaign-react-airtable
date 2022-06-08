import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  containerText: { padding: "35px 25px" },
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 0 25px 0",
  },
  button: { color: "white", fontWeight: "bold" },
};

export const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("xs")]: {
    addiotnalText: {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
      margin: 0,
    },
    text: { fontSize: 18, textAlign: "center", padding: "10px 0", margin: 0 },
  },
  [theme.breakpoints.up("sm")]: {
    additionalText: {
      fontSize: 25,
      textAlign: "center",
      fontWeight: "bold",
      padding: 10,
      margin: 0,
    },
    text: { fontSize: 25, textAlign: "center", padding: "10px 0", margin: 0 },
    paper: {
      minWidth: 400,
      maxWidth: 500,
    },
  },
}));
