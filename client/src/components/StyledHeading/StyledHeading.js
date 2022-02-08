import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginBottom: 50,
    fontSize: 30,
    color: "white",
    letterSpacing: 2,
    wordSpacing: 15,
    textAlign: "center",
    textTransform: "uppercase",
    [theme.breakpoints.up("md")]: {
      fontSize: 50,
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
