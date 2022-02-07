import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Grid, Tab } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import { StyledTabs } from "../MainNavigation/StyledTabs";

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
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: "0 0 5px 5px",
  },
};

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "#142f43",
    fontSize: 16,
    letterSpacing: 2,
    padding: 0,
    margin: 0,
    "&:first-child": {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(4),
    },
  },
}));

const SubMainNavigation = ({ dataLinks, tabsValue }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabsSubValue, setTabsSubValue] = useState(0);

  useEffect(() => {
    if (tabsValue === 0 || tabsValue === 1) {
      setTabsSubValue(0);
    }
  }, [tabsValue]);

  const handleClickTab = (e, newTabsValue) => setTabsSubValue(newTabsValue);
  return (
    <>
      {!isSmallDevice ? (
        <div>
          <nav style={styles.nav}>
            <Grid
              container
              style={styles.grid}
              direction="row"
              justifyContent="space-between"
            >
              <StyledTabs onChange={handleClickTab} value={tabsSubValue}>
                {dataLinks.map(({ to, name }) => (
                  <Tab
                    key={name}
                    disableRipple
                    label={name}
                    component={Link}
                    to={to}
                    className={classes.link}
                  />
                ))}
              </StyledTabs>
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

SubMainNavigation.propTypes = {
  dataLinks: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      exact: PropTypes.bool,
      name: PropTypes.string,
    })
  ),
};

export default SubMainNavigation;
