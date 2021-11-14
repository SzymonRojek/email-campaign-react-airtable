const headingStyles = {
  textAlign: "center",
  margin: "100px 0 60px 0",
  color: "#142F43",
  letterSpacing: 2,
  wordSpacing: 15,
};

const StyledHeading = ({ label }) => <h1 style={headingStyles}>{label}</h1>;

export default StyledHeading;
