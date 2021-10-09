import { Link, useLocation, useResolvedLocation } from "react-router-dom";

const NavLink = ({ to, exact, style, active, inactive, ...rest }) => {
  const location = useLocation();
  const resolvedLocation = useResolvedLocation(to);

  let isActive;
  if (exact) {
    isActive = location.pathname === resolvedLocation.pathname;
  } else {
    isActive = location.pathname.startsWith(resolvedLocation.pathname);
  }

  return <Link style={isActive ? active : inactive} to={to} {...rest} />;
};

export default NavLink;
