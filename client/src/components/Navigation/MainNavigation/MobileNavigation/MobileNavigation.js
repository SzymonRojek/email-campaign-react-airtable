import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
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
import { AiFillHome } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";

import { LogFormButton } from "components/LogFormButton";
import { campaignsLinks, subscribersLinks } from "data/dataLinksNavigation";

const style = {
  drawer: { zIndex: 10 },
  icon: { fontSize: 35 },
};

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    maxWidth: 230,
    backgroundColor: "#142f43",
  },
  listItemIcon: { color: "orange", fontSize: 17 },
  linkCollapse: {
    color: "orange",
    fontSize: 20,
    textTransform: "uppercase",
  },
  link: {
    textDecoration: "none",
    color: "#ffffff8c",
    fontSize: 20,
  },
  menuIconContainer: {
    textAlign: "right",
    "& .MuiIconButton-root": {
      padding: 0,
      color: "orange",
    },
  },
  mainDivider: { backgroundColor: "#7a6032" },
  subDivider: { backgroundColor: "#9c98988c" },
  logInButton: {
    maxWidth: 120,
    padding: "12px 20px",
    fontSize: 12,
    fontWeight: "bold",
    color: "#142f43",
    backgroundColor: "orange",
    textTransform: "uppercase",
    border: "none",
    borderRadius: 3,
    cursor: "pointer",
  },
}));

const StyledListItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#102636",
    },
    "&:hover": {
      backgroundColor: "#102636",
    },
  },
})(ListItem);

const MobileNavigation = ({ setTabsValue, setIsLogIn, setStatusLog }) => {
  const classes = useStyles();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubscribersLinks, setOpenSubscribersLinks] = useState(false);
  const [openCampaignsLinks, setOpenCampaignsLinks] = useState(false);

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
        style={style.drawer}
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
                <ListItemText primary="Subscribers" />
                {openSubscribersLinks ? <IconExpandLess /> : <IconExpandMore />}
              </ListItem>
              <Divider className={classes.mainDivider} />

              <Collapse in={openSubscribersLinks} timeout="auto" unmountOnExit>
                {subscribersLinks.map(({ icon, to, name, tabsValue }) => (
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
                        <ListItemIcon className={classes.listItemIcon}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText onClick={() => setTabsValue(tabsValue)}>
                          {name}
                        </ListItemText>
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
                  <MdAlternateEmail />
                </ListItemIcon>
                <ListItemText primary="Campaigns" />
                {openCampaignsLinks ? <IconExpandLess /> : <IconExpandMore />}
              </ListItem>
              <Divider className={classes.mainDivider} />

              <Collapse in={openCampaignsLinks} timeout="auto" unmountOnExit>
                {campaignsLinks.map(({ icon, to, name, tabsValue }) => {
                  return (
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
                          <ListItemIcon className={classes.listItemIcon}>
                            {icon}
                          </ListItemIcon>
                          <ListItemText onClick={() => setTabsValue(tabsValue)}>
                            {name}
                          </ListItemText>
                        </StyledListItem>
                      </Link>
                      <Divider className={classes.subDivider} />
                    </div>
                  );
                })}
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
            <MenuIcon style={style.icon} />
          ) : (
            <MenuOpenIcon style={style.icon} />
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
