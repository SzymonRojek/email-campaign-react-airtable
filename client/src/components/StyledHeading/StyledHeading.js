import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginTop: 150,
    marginBottom: 30,
    color: "white",
    fontSize: 40,
    letterSpacing: 2,
    wordSpacing: 15,
    textAlign: "center",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
    [theme.breakpoints.up("md")]: {
      marginTop: 280,
      fontSize: 30,
    },
  },
}));

const StyledHeading = ({ label }) => {
  const classes = useStyles();

  return <h1 className={classes.heading}>{label}</h1>;
};

StyledHeading.propTypes = {
  label: PropTypes.string,
};

export default StyledHeading;
