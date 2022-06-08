import PropTypes from "prop-types";

import { useStyles } from "./styles";

const StyledHeading = ({ label }) => {
  const classes = useStyles();

  return <h1 className={classes.heading}>{label}</h1>;
};

StyledHeading.propTypes = {
  label: PropTypes.string,
};

export default StyledHeading;
