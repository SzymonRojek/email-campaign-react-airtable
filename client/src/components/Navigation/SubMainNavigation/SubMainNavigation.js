import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import clsx from "clsx";
import { Collapse, Tab } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Divider, useMediaQuery } from "@material-ui/core";
import { MdArrowDropDown } from "react-icons/md";

import { StyledTabs } from "../MainNavigation/StyledTabs";
import { IconButton } from "@mui/material";
import { campaignsLinks, subscribersLinks } from "data/dataLinksNavigation";

const styles = {
  nav: {
    width: "100%",
    position: "fixed",
    top: 105,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  navSubContainer: {
    width: 400,
    textAlign: "right",
    backgroundColor: "orange",
    borderRadius: "0 0 5px 5px",
    boxShadow: " -1px 10px 33px -13px rgba(0,0,0,0.57)",
  },
  link: {
    margin: "0 10px",
    fontSize: 20,
  },
  tabs: { backgroundColor: "#142f43" },
  collapse: {
    padding: 20,
  },
  iconButtonCollapse: {
    marginRight: 15,
    padding: 8,
    color: "#142f43",
    backgroundColor: "transparent",
  },
  icon: { color: "#142f43" },
};

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const SubMainNavigation = ({ tabsValue }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabsSubValue, setTabsSubValue] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const handleClickTab = (e, newTabsValue) => setTabsSubValue(newTabsValue);
  const handleCheckLocation = (pathname) =>
    window.location.toString().indexOf(pathname) !== -1;

  useEffect(() => {
    if (tabsValue === 0 || tabsValue === 1) {
      setTabsSubValue(0);
    }
  }, [tabsValue]);

  return (
    <>
      {!isSmallDevice ? (
        <>
          <nav style={styles.nav}>
            <div style={styles.navSubContainer}>
              <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                style={styles.collapse}
              >
                <StyledTabs
                  onChange={handleClickTab}
                  value={tabsSubValue}
                  style={styles.tabs}
                >
                  {handleCheckLocation("/subscribers")
                    ? subscribersLinks.map(({ to, name, icon }) => (
                        <Tab
                          key={name}
                          icon={<span style={styles.icon}>{icon}</span>}
                          disableRipple
                          component={Link}
                          to={to}
                          style={styles.link}
                        />
                      ))
                    : campaignsLinks.map(({ to, name, icon }) => (
                        <Tab
                          key={name}
                          icon={<span style={styles.icon}>{icon}</span>}
                          disableRipple
                          component={Link}
                          to={to}
                          style={styles.link}
                        />
                      ))}
                </StyledTabs>
              </Collapse>
              <Divider />

              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="open sub-navigation"
                disableRipple
                style={styles.iconButtonCollapse}
              >
                <MdArrowDropDown />
              </IconButton>
            </div>
          </nav>
          <div>
            <Outlet />
          </div>
        </>
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
