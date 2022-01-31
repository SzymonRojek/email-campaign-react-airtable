import PropTypes from "prop-types";

const headingStyles = {
  marginBottom: 40,
  paddingTop: 35,
  color: "#142F43",
  letterSpacing: 2,
  wordSpacing: 15,
  textAlign: "center",
  textTransform: "uppercase",
  textShadow: "-2px 2px white",
};

const StyledHeading = ({ label }) => <h1 style={headingStyles}>{label}</h1>;

StyledHeading.propTypes = {
  label: PropTypes.string,
};

export default StyledHeading;
