import PropTypes from "prop-types";

const headingStyles = {
  textAlign: "center",
  marginTop: 60,
  marginBottom: 40,
  color: "#142F43",
  letterSpacing: 2,
  wordSpacing: 15,
};

const StyledHeading = ({ label }) => <h1 style={headingStyles}>{label}</h1>;

StyledHeading.propTypes = {
  label: PropTypes.string.isRequired,
};

export default StyledHeading;
