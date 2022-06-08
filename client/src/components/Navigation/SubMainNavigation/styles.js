import { makeStyles } from "@material-ui/core/styles";

export const styles = {
  nav: {
    width: "100%",
    position: "fixed",
    top: 105,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  navSubContainer: {
    width: 400,
    textAlign: "right",
    backgroundColor: "orange",
    borderRadius: "0 0 5px 5px",
    boxShadow: " -1px 10px 33px -13px rgba(0,0,0,0.57)",
  },
  link: {
    margin: "0 10px",
    fontSize: 20,
  },
  tabs: { backgroundColor: "#142f43" },
  collapse: {
    padding: 20,
  },
  iconButtonCollapse: {
    marginRight: 15,
    padding: 8,
    color: "#142f43",
    backgroundColor: "transparent",
  },
  icon: { color: "#142f43" },
};

export const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));
