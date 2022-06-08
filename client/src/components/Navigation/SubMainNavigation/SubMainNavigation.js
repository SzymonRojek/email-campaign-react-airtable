import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Collapse, Tab } from "@mui/material";
import { useTheme } from "@material-ui/core/styles";
import { Divider, useMediaQuery } from "@material-ui/core";
import { MdArrowDropDown } from "react-icons/md";

import { styles, useStyles } from "./styles";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { StyledTabs } from "../MainNavigation/StyledTabs";
import { IconButton } from "@mui/material";
import { campaignsLinks, subscribersLinks } from "data/dataLinksNavigation";

const SubMainNavigation = () => {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { pathname } = useLocation();

  const { setTabsValue, tabsSubValue, setTabsSubValue } =
    useGlobalStoreContext();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const handleClickTab = (e, newTabsValue) => setTabsSubValue(newTabsValue);

  const handleChangeTabsOnReload = useCallback(() => {
    switch (pathname) {
      case "/subscribers":
        setTabsValue(0);
        setTabsSubValue(0);
        break;
      case "/campaigns":
        setTabsValue(1);
        setTabsSubValue(0);
        break;
      case "/subscribers/status":
        setTabsValue(0);
        setTabsSubValue(1);
        break;
      case "/campaigns/status":
        setTabsValue(1);
        setTabsSubValue(1);
        break;
      case "/subscribers/add":
        setTabsValue(0);
        setTabsSubValue(2);
        break;
      case "/campaigns/add":
        setTabsValue(1);
        setTabsSubValue(2);
        break;
      default:
        console.log(`This is a ${pathname}`);
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
                  {window.location.href.indexOf("/subscribers") > -1
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
