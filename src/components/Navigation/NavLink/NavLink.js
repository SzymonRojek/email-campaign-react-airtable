import { Link, useLocation, useResolvedLocation } from "react-router-dom";
import { Button } from "@mui/material";

const NavLink = ({ to, exact, style, active, inactive, name, ...rest }) => {
  const location = useLocation();
  const resolvedLocation = useResolvedLocation(to);

  let isActive;
  if (exact) {
    isActive = location.pathname === resolvedLocation.pathname;
  } else {
    isActive = location.pathname.startsWith(resolvedLocation.pathname);
  }

  return (
    <Link style={isActive ? active : inactive} to={to} {...rest}>
      <Button
        disableRipple
        disableElevation
        style={
          isActive
            ? {
                color: "#003049",
                width: 100,
                "&.MuiButtonBase-root:hover": {
                  backgroundColor: "transparent",
                },
              }
            : {
                color: "#fff",
                width: 100,
                "&.MuiButtonBase-root:hover": {
                  backgroundColor: "transparent",
                },
              }
        }
      >
        {name}
      </Button>
    </Link>
  );
};

export default NavLink;
