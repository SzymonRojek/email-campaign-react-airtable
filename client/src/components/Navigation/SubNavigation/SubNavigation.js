import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import StyledLink from "./StyledLink";

const styles = {
  nav: {
    position: "fixed",
    top: 100,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
    width: "100%",
  },
  grid: {
    maxWidth: 480,
    padding: "20px 20px 20px 15px",
    backgroundColor: "#142f43",
    borderRadius: "0 0 5px 5px",
  },
};

const SubNavigation = ({ dataLinks }) => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {!isSmallDevice ? (
        <div>
          <nav style={styles.nav}>
            <Grid
              container
              style={styles.grid}
              direction="row"
              justifyContent="space-evenly"
            >
              {dataLinks.map(({ to, exact, name }, index) => (
                <Grid item key={index} md={3}>
                  <StyledLink to={to} exact={exact}>
                    {name}
                  </StyledLink>
                </Grid>
              ))}
            </Grid>
          </nav>

          <div>
            <Outlet />
          </div>
        </div>
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};

SubNavigation.propTypes = {
  dataLinks: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      exact: PropTypes.bool,
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export default SubNavigation;
