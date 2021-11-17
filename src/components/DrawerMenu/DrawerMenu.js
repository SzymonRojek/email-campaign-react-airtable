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
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { SiStatuspage } from "react-icons/si";
import { MdPeopleAlt } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";

import { MdOutlineMarkEmailRead } from "react-icons/md";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    maxWidth: 230,
    backgroundColor: "#142f43",
  },
  listItemIcon: { color: "orange", fontSize: 17 },
  listItemLogo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
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
  logo: {
    color: "orange",
    fontSize: 45,
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

  useEffect(() => {
    if (!openDrawer) {
      setOpenSubscribersLinks(false);
      setOpenCampaignsLinks(false);
    }
  }, [openDrawer, openSubscribersLinks, openCampaignsLinks]);

  const activeSelectedLink = (strOne, strTwo) =>
    window.location.href.indexOf(strOne) > -1
      ? strOne
      : window.location.href.indexOf(strTwo) > -1
      ? strTwo
      : "";

  const handleSubscribersClick = () => {
    setOpenSubscribersLinks(!openSubscribersLinks);
    setOpenCampaignsLinks(false);
  };

  const handleCampaignsClick = () => {
    setOpenCampaignsLinks(!openCampaignsLinks);
    setOpenSubscribersLinks(false);
  };

  return (
    <>
      <Drawer
        style={{
          position: "fixed",
        }}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          className={classes.container}
        >
          <Grid container item>
            <ListItem className={classes.listItemLogo}>
              <ListItemIcon className={classes.logo}>
                <GoMailRead />
              </ListItemIcon>
            </ListItem>
          </Grid>
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

              <Collapse in={openSubscribersLinks} timeout="auto" unmountOnExit>
                <Divider />
                {subscribersLinks.map(({ icon, to, name, tabsValue }) => {
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
                    <div key={`key-${uniqueId()}`}>
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
          </Grid>
        </Grid>
      </Drawer>
      <IconButton
        className={classes.menuIcon}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {!openDrawer ? (
          <MenuIcon style={{ fontSize: 35 }} />
        ) : (
          <MenuOpenIcon style={{ fontSize: 35 }} />
        )}
      </IconButton>
    </>
  );
}

export default DrawerMenu;
