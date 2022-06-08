import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  button: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "white",
  },
  paragraph: {
    padding: "8px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 80,
    display: "flex",
    justifyContent: "center",
  },
  icon: { marginLeft: 10, color: "white" },
};

export const useStyles = makeStyles((theme) => ({
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#ddd",
    borderRadius: 4,
    padding: "5px 10px",
    display: "inline-block",
  },

  cellNo: { width: 25 },
  cell: { wordWrap: "break-word", width: 100 },
}));
