import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  typography: {
    padding: "8px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 80,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "white",
  },
  icon: { marginLeft: 10 },
  questionText: { color: "crimson", fontWeight: "bold" },
};

export const useStyles = makeStyles(() => ({
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
  disableButton: {
    "&.MuiButton-root.MuiButton-contained": { backgroundColor: "#b3b3b3" },

    "&:hover": {
      backgroundColor: "#b3b3b3",
    },
  },
}));
