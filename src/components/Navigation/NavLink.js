import { Link, useLocation, useResolvedLocation } from "react-router-dom";

const common = {
  margin: 15,
  padding: "10px 15px",
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 1,
  textDecoration: "none",
  borderRadius: 4,
};

const activeClassName = {
  color: "#fff",
  backgroundColor: "#303f9f",
  ...common,
};

const inactiveClassName = {
  color: "#303f9f",
  backgroundColor: "#fff",
  ...common,
};

const NavLink = ({ to, exact, style, ...rest }) => {
  let location = useLocation();
  let resolvedLocation = useResolvedLocation(to);

  let isActive;
  if (exact) {
    isActive = location.pathname === resolvedLocation.pathname;
  } else {
    isActive = location.pathname.startsWith(resolvedLocation.pathname);
  }

  return (
    <Link
      style={isActive ? activeClassName : inactiveClassName}
      to={to}
      {...rest}
    />
  );
};

export default NavLink;
