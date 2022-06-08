import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  label: { color: "rgb(221, 220, 220) !important" },
  textField: {
    "& .MuiOutlinedInput-root": {
      color: "rgb(221, 220, 220)",
      marginBottom: 6,
      "& fieldset": {
        borderColor: "rgb(221, 220, 220)",
      },
      "&:hover fieldset": {
        borderColor: "rgb(221, 220, 220)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ffa500",
      },
    },
    "& .MuiIconButton-root": {
      color: "#ffa500",
    },
  },
  typography: { color: "crimson" },
});
