import PropTypes from "prop-types";
import { Link, useLocation, useResolvedLocation } from "react-router-dom";

const commonStyles = {
  display: "flex",
  justifyContent: "center",
  padding: "8px 23px",
  width: 130,
  fontSize: 12,
  textDecoration: "none",
  letterSpacing: 2,
  borderRadius: 4,
  textTransform: "uppercase",
};

const activeLink = {
  color: "#003049",
  backgroundColor: "white",
  border: "3px solid #003049",
  ...commonStyles,
};

const unactiveLink = {
  color: "#fff",
  backgroundColor: "#003049",
  border: "3px solid #003049",
  ...commonStyles,
};

const StyledLink = ({ to, exact, ...rest }) => {
  const location = useLocation();
  const resolvedLocation = useResolvedLocation(to);

  let isActive;

  if (exact) {
    isActive = location.pathname === resolvedLocation.pathname;
  } else {
    isActive = location.pathname.startsWith(resolvedLocation.pathname);
  }

  return (
    <Link style={isActive ? activeLink : unactiveLink} to={to} {...rest} />
  );
};

StyledLink.propTypes = {
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  rest: PropTypes.object,
};

export default StyledLink;
