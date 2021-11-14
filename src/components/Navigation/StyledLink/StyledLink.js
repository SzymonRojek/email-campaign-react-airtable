import { Link, useLocation, useResolvedLocation } from "react-router-dom";

const common = {
  display: "flex",
  justifyContent: "center",
  padding: "8px 20px",
  width: 130,
  fontSize: 14,
  textDecoration: "none",
  letterSpacing: 2,
  borderRadius: 4,
};

const activeLink = {
  color: "#003049",
  border: "3px solid #003049",
  ...common,
};

const unactiveLink = {
  color: "#fff",
  backgroundColor: "#003049",
  border: "3px solid #003049",
  ...common,
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

export default StyledLink;
