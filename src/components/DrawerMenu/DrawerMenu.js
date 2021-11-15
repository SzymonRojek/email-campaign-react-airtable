import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
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

const useStyles = makeStyles(() => ({
  listContainer: {
    backgroundColor: "#142f43",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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

  divider: { backgroundColor: "#ffffff8c" },
}));

const subscribersLinks = [
  {
    icon: <IoIosPeople />,
    to: "/subscribers",
    name: "Subscribers",
    tabsValue: 0,
  },
  {
    icon: <SiStatuspage />,
    to: "/subscribers/filter",
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

const campaignsLinks = [
  {
    icon: <AiFillMail />,
    to: "/campaigns",
    name: "Campaigns",
    tabsValue: 1,
  },
  {
    icon: <SiStatuspage />,
    to: "/campaigns/filter",
    name: "Status",
    tabsValue: 0,
  },
  {
    icon: <MdOutlineMarkEmailRead />,
    to: "/campaigns/add",
    name: "Add New",
    tabsValue: 0,
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

function DrawerMenu({ setTabsValue }) {
  const classes = useStyles();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubscribersLinks, setOpenSubscribersLinks] = useState(false);
  const [openCampaignsLinks, setOpenCampaignsLinks] = useState(false);

  const activeSelectedLink = (strOne, strTwo) =>
    window.location.href.indexOf(strOne) > -1
      ? strOne
      : window.location.href.indexOf(strTwo) > -1
      ? strTwo
      : "";

  const handleSubscribersClick = () =>
    setOpenSubscribersLinks(!openSubscribersLinks);
  const handleCampaignsClick = () => setOpenCampaignsLinks(!openCampaignsLinks);

  return (
    <>
      <Drawer
        style={{ zIndex: 1 }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <div className={classes.listContainer}>
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
            <Collapse in={openSubscribersLinks} timeout="auto" unmountOnExit>
              <Divider />
              {subscribersLinks.map(({ icon, to, name, tabsValue }) => {
                return (
                  <div key={`key-${tabsValue}`}>
                    <Link
                      to={to}
                      onClick={() => setTabsValue(tabsValue)}
                      className={classes.link}
                    >
                      <StyledListItem
                        button
                        onClick={() => setOpenDrawer(false)}
                        selected={
                          to === location.pathname ||
                          to ===
                            activeSelectedLink("/subscribers", "/campaigns")
                        }
                      >
                        <ListItemIcon className={classes.listItemIcon}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText onClick={() => setTabsValue(tabsValue)}>
                          {name}
                        </ListItemText>
                      </StyledListItem>
                    </Link>
                    <Divider className={classes.divider} />
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
            <Collapse in={openCampaignsLinks} timeout="auto" unmountOnExit>
              <Divider />
              {campaignsLinks.map(({ icon, to, name, tabsValue }) => {
                return (
                  <div key={`key-${tabsValue}`}>
                    <Link
                      to={to}
                      onClick={() => setTabsValue(tabsValue)}
                      className={classes.link}
                    >
                      <StyledListItem
                        button
                        onClick={() => setOpenDrawer(false)}
                        selected={
                          to === location.pathname ||
                          to ===
                            activeSelectedLink("/subscribers", "/campaigns")
                        }
                      >
                        <ListItemIcon className={classes.listItemIcon}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText onClick={() => setTabsValue(tabsValue)}>
                          {name}
                        </ListItemText>
                      </StyledListItem>
                    </Link>
                    <Divider className={classes.divider} />
                  </div>
                );
              })}
            </Collapse>
          </List>
          <div key={`key-${2}`}>
            <Link
              to="/"
              onClick={() => setTabsValue(2)}
              className={classes.link}
            >
              <StyledListItem
                button
                onClick={() => setOpenDrawer(false)}
                selected={
                  "/" === location.pathname ||
                  "/" === activeSelectedLink("/subscribers", "/campaigns")
                }
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <AiFillHome />
                </ListItemIcon>
                <ListItemText onClick={() => setTabsValue(2)}>
                  Home
                </ListItemText>
              </StyledListItem>
            </Link>
            <Divider className={classes.divider} />
          </div>
        </div>
      </Drawer>
      <IconButton
        className={classes.menuIcon}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {!openDrawer ? (
          <MenuIcon style={{ fontSize: 35 }} />
        ) : (
          <MenuOpenIcon style={{ fontSize: 35, zIndex: 2 }} />
        )}
      </IconButton>
    </>
  );
}

export default DrawerMenu;
