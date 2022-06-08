import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { uniqueId } from "lodash";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import { MdPeopleAlt } from "react-icons/md";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";

import { styles, useStyles, StyledListItem } from "./styles";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { LogFormButton } from "components/LogFormButton";
import { campaignsLinks, subscribersLinks } from "data/dataLinksNavigation";

const MobileNavigation = () => {
  const classes = useStyles();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubscribersLinks, setOpenSubscribersLinks] = useState(false);
  const [openCampaignsLinks, setOpenCampaignsLinks] = useState(false);
  const { setIsLogIn, setStatusLog, setTabsValue } = useGlobalStoreContext();

  useEffect(() => {
    if (!openDrawer) {
      setOpenSubscribersLinks(false);
      setOpenCampaignsLinks(false);
    }
  }, [openDrawer, openSubscribersLinks, openCampaignsLinks]);

  const handleSubscribersClick = () => {
    setOpenSubscribersLinks(!openSubscribersLinks);
    setOpenCampaignsLinks(false);
  };

  const handleCampaignsClick = () => {
    setOpenCampaignsLinks(!openCampaignsLinks);
    setOpenSubscribersLinks(false);
  };

  const handleChangeStates = () => {
    const timeID = setTimeout(() => {
      setIsLogIn(false);
      setStatusLog("loadingIn");
    }, 2_000);

    return () => clearTimeout(timeID);
  };

  return (
    <>
      <Drawer
        anchor="right"
        style={styles.drawer}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          className={classes.container}
        >
          <Grid item>
            <List>
              <ListItem
                button
                onClick={handleSubscribersClick}
                className={classes.linkCollapse}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <MdPeopleAlt />
                </ListItemIcon>
                <ListItemText
                  primary="Subscribers"
                  className={classes.listItemText}
                />
                {openSubscribersLinks ? <IconExpandLess /> : <IconExpandMore />}
              </ListItem>
              <Divider className={classes.mainDivider} />

              <Collapse in={openSubscribersLinks} timeout="auto" unmountOnExit>
                {subscribersLinks.map(({ icon, to, tabsValue }) => (
                  <div key={`key-${uniqueId()}`}>
                    <Link
                      to={to}
                      onClick={() => setTabsValue(tabsValue)}
                      className={classes.link}
                    >
                      <StyledListItem
                        button
                        onClick={() => setOpenDrawer(false)}
                        selected={to === location.pathname}
                      >
                        <ListItemIcon
                          className={classes.listItemIcon}
                          onClick={() => setTabsValue(tabsValue)}
                        >
                          {icon}
                        </ListItemIcon>
                      </StyledListItem>
                    </Link>
                    <Divider className={classes.subDivider} />
                  </div>
                ))}
              </Collapse>
            </List>
            <List>
              <ListItem
                button
                onClick={handleCampaignsClick}
                className={classes.linkCollapse}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <AiFillMail />
                </ListItemIcon>
                <ListItemText primary="Campaigns" />
                {openCampaignsLinks ? <IconExpandLess /> : <IconExpandMore />}
              </ListItem>
              <Divider className={classes.mainDivider} />

              <Collapse in={openCampaignsLinks} timeout="auto" unmountOnExit>
                {campaignsLinks.map(({ icon, to, tabsValue }) => (
                  <div key={`key-${uniqueId()}`}>
                    <Link
                      to={to}
                      onClick={() => setTabsValue(tabsValue)}
                      className={classes.link}
                    >
                      <StyledListItem
                        button
                        onClick={() => setOpenDrawer(false)}
                        selected={to === location.pathname}
                      >
                        <ListItemIcon
                          className={classes.listItemIcon}
                          onClick={() => setTabsValue(tabsValue)}
                        >
                          {icon}
                        </ListItemIcon>
                      </StyledListItem>
                    </Link>
                    <Divider className={classes.subDivider} />
                  </div>
                ))}
              </Collapse>
            </List>
          </Grid>
          <Grid item>
            <Link
              to="/"
              onClick={() => setTabsValue(2)}
              className={classes.link}
            >
              <StyledListItem
                button
                onClick={() => setOpenDrawer(false)}
                selected={"/" === location.pathname}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <AiFillHome />
                </ListItemIcon>
                <ListItemText onClick={() => setTabsValue(2)}>
                  Home
                </ListItemText>
              </StyledListItem>
            </Link>
            <Divider className={classes.subDivider} />

            <div style={{ textAlign: "center", marginTop: 80 }}>
              <LogFormButton
                aria-label="log out button"
                label="log out"
                onClick={() => {
                  setStatusLog("loadingOut");
                  handleChangeStates();
                }}
                className={classes.logInButton}
              />
            </div>
          </Grid>
        </Grid>
      </Drawer>
      <div className={classes.menuIconContainer}>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)} disableRipple>
          {!openDrawer ? (
            <MenuIcon style={styles.menuIcon} />
          ) : (
            <MenuOpenIcon style={styles.menuIcon} />
          )}
        </IconButton>
      </div>
    </>
  );
};

MobileNavigation.propTypes = {
  setTabsValue: PropTypes.func,
  setIsLogIn: PropTypes.func,
  setStatusLog: PropTypes.func,
};

export default MobileNavigation;
