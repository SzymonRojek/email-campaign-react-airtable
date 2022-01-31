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
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { SiStatuspage } from "react-icons/si";
import { MdPeopleAlt } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineMarkEmailRead } from "react-icons/md";

import { LogFormButton } from "components/LogFormButton";

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
  menuIcon: {
    color: "orange",
  },
  mainDivider: { backgroundColor: "#7a6032" },
  subDivider: { backgroundColor: "#9c98988c" },
}));

const subscriberLinks = [
  {
    icon: <IoIosPeople />,
    to: "/subscribers",
    name: "Subscribers",
    tabsValue: 0,
  },
  {
    icon: <SiStatuspage />,
    to: "/subscribers/status",
    name: "Status",
    tabsValue: 0,
  },
  {
    icon: <BsFillPersonPlusFill />,
    to: "/subscribers/add",
    name: "Add New",
    tabsValue: 0,
  },
];

const campaignLinks = [
  {
    icon: <AiFillMail />,
    to: "/campaigns",
    name: "Campaigns",
    tabsValue: 1,
  },
  {
    icon: <SiStatuspage />,
    to: "/campaigns/status",
    name: "Status",
    tabsValue: 1,
  },
  {
    icon: <MdOutlineMarkEmailRead />,
    to: "/campaigns/add",
    name: "Add New",
    tabsValue: 1,
  },
];

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
                {subscriberLinks.map(({ icon, to, name, tabsValue }) => {
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
                {campaignLinks.map(({ icon, to, name, tabsValue }) => {
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
              />
            </div>
          </Grid>
        </Grid>
      </Drawer>
      <IconButton
        className={classes.menuIcon}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {!openDrawer ? (
          <MenuIcon style={style.icon} />
        ) : (
          <MenuOpenIcon style={style.icon} />
        )}
      </IconButton>
    </>
  );
};

MobileNavigation.propTypes = {
  setTabsValue: PropTypes.func.isRequired,
};

export default MobileNavigation;
