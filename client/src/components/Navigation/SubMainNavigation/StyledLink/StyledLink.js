import PropTypes from "prop-types";
import { Link, useLocation, useResolvedLocation } from "react-router-dom";

const commonStyles = {
  display: "flex",
  justifyContent: "center",
  padding: "10px",
  width: 110,
  fontSize: 12,
  textDecoration: "none",
  letterSpacing: 2,
  textTransform: "uppercase",
};

const activeLink = {
  color: "white",
  borderBottom: "2px solid orange",
  ...commonStyles,
};

const unactiveLink = {
  color: "#b8c0c6",
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
  to: PropTypes.string,
  exact: PropTypes.bool,
  rest: PropTypes.object,
};

export default StyledLink;
