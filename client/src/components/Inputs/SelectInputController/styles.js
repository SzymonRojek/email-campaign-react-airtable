import { makeStyles } from "@material-ui/core/styles";

export const useMenuItemStyles = makeStyles((theme) => ({
  root: {
    "&.MuiMenuItem-root": {
      padding: 10,
      backgroundColor: "#22445f !important",
      borderBottom: "1px solid rgb(221, 220, 220) !important",
      color: "rgb(221, 220, 220) !important",
      display: "flex",
      justifyContent: "center",

      "&:hover": {
        color: "rgb(221, 220, 220)",
        backgroundColor: "#142f43 !important",
      },
    },
  },
}));
