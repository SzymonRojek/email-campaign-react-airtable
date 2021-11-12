import { Link, useLocation, useResolvedLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    width: 100,
  },
}));

const NavLink = ({ to, exact, style, active, inactive, name, ...rest }) => {
  const location = useLocation();
  const resolvedLocation = useResolvedLocation(to);
  const classes = useStyles();

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
        classes={{ root: classes.root }}
        style={
          isActive
            ? {
                color: "#003049",
                letterSpacing: 2,
                fontSize: 12,
              }
            : {
                color: "#fff",
                letterSpacing: 2,
                fontSize: 12,
              }
        }
      >
        {name}
      </Button>
    </Link>
  );
};

export default NavLink;
