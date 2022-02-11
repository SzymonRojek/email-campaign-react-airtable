import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  select: {
    "& .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },

    "& .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiSvgIcon-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffa500",
    },
  },
  addButton: {
    "&.MuiButton-root.MuiButton-contained": {
      backgroundColor: "orange",
      border: 0,
      color: "#142f43",
      fontWeight: "bold",
      letterSpacing: 1,
      padding: "10px 15px",

      "&:hover": {
        backgroundColor: "#ca880e",
        color: "#FFF",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
        padding: 10,
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
    margin: "auto",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#142F43",
  },
  typographyRequiredText: { color: "orange", letterSpacing: 2, wordSpacing: 3 },
  textError: { color: "crimson", paddingTop: 10 },
  icon: { color: "orange", fontSize: 30, marginTop: 6 },
};
