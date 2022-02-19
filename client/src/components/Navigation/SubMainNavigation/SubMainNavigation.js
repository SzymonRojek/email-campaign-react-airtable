import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Collapse, Tab } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Divider, useMediaQuery } from "@material-ui/core";
import { MdArrowDropDown } from "react-icons/md";

import { StyledTabs } from "../MainNavigation/StyledTabs";
import { IconButton } from "@mui/material";
import { campaignsLinks, subscribersLinks } from "data/dataLinksNavigation";
import { usePopupContext } from "contexts/popupContextProvider";

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

const SubMainNavigation = () => {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { pathname } = useLocation();

  const { setTabsValue, tabsSubValue, setTabsSubValue } = usePopupContext();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const handleClickTab = (e, newTabsValue) => setTabsSubValue(newTabsValue);
  const handleCheckLocation = (pathname) =>
    window.location.toString().indexOf(pathname) !== -1;

  const handleChangeTabsOnReload = useCallback(() => {
    if (pathname === "/subscribers") {
      setTabsValue(0);
      setTabsSubValue(0);
    } else if (pathname === "/campaigns") {
      setTabsValue(1);
      setTabsSubValue(0);
    } else if (pathname === "/subscribers/status") {
      setTabsValue(0);
      setTabsSubValue(1);
    } else if (pathname === "/campaigns/status") {
      setTabsValue(1);
      setTabsSubValue(1);
    } else if (pathname === "/subscribers/add") {
      setTabsValue(0);
      setTabsSubValue(2);
    } else if (pathname === "campaigns/add") {
      setTabsValue(1);
      setTabsSubValue(2);
    }
  }, [pathname, setTabsSubValue, setTabsValue]);

  useEffect(() => {
    handleChangeTabsOnReload();
  }, [handleChangeTabsOnReload]);

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
