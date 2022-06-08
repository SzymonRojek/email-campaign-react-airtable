import { withStyles, makeStyles } from "@material-ui/core/styles";
import { ListItem } from "@material-ui/core";

export const styles = {
  drawer: { zIndex: 10 },
  menuIcom: { fontSize: 35 },
};

export const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    maxWidth: 230,
    backgroundColor: "#142f43",
  },
  listItemIcon: { color: "orange", fontSize: 17, textAlign: "center" },
  listItemText: { paddingRight: 8 },
  linkCollapse: {
    color: "orange",
    fontSize: 20,
    textTransform: "uppercase",
  },
  link: {
    textDecoration: "none",
    color: "#ffffff8c",
    fontSize: 20,
  },
  menuIconContainer: {
    textAlign: "right",
    "& .MuiIconButton-root": {
      padding: 0,
      color: "orange",
    },
  },
  mainDivider: { backgroundColor: "#7a6032" },
  subDivider: { backgroundColor: "#9c98988c" },
  logInButton: {
    "&.MuiButton-root": {
      maxWidth: 120,
      padding: "8px 15px",
      fontSize: 12,
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

export const StyledListItem = withStyles({
  root: {
    "&.MuiListItem-root": {
      justifyContent: "space-around",
    },
    "&.MuiListItemIcon-root": {
      justifyContent: "space-around",
    },
    "&.Mui-selected": {
      backgroundColor: "#102636",
    },
    "&:hover": {
      backgroundColor: "#102636",
    },
  },
})(ListItem);
