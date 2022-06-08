import { inputLabelClasses } from "@mui/material/InputLabel";
import { makeStyles, createStyles } from "@material-ui/core/styles";

export const inputLabelProps = {
  sx: {
    // set the color of the label when not shrinked
    color: "rgb(221, 220, 220)",
    [`&.${inputLabelClasses.shrink}`]: {
      // set the color of the label when shrinked (usually when the TextField is focused)
      // color: "#ffa500 !important",
      letterSpacing: 1,
    },
  },
};

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiInputBase-root": {
        color: "rgb(221, 220, 220)",
      },
      "& label.Mui-focused": {
        color: "rgb(221, 220, 220)",
      },
      "& .MuiOutlinedInput-root": {
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
    },
  })
);
