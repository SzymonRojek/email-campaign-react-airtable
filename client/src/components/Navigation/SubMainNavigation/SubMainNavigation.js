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
    maxWidth: 490,
    padding: 20,
    backgroundColor: "orange",
    borderRadius: "0 0 5px 5px",
    boxShadow: " -1px 10px 33px -13px rgba(0,0,0,0.57)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    fontSize: 17,

    padding: "0 24px",
  },
  tabs: { backgroundColor: "#142f43" },
};

const useStyles = makeStyles((theme) => ({
  link: {
    "&:first-child": {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(6),
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
            {/* <Grid container style={styles.grid}> */}
            <div style={styles.grid}>
              <StyledTabs
                onChange={handleClickTab}
                value={tabsSubValue}
                style={styles.tabs}
              >
                {dataLinks.map(({ to, name }) => (
                  <Tab
                    key={name}
                    disableRipple
                    label={name}
                    component={Link}
                    to={to}
                    className={classes.link}
                    style={styles.link}
                  />
                ))}
              </StyledTabs>
            </div>
            {/* </Grid> */}
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
