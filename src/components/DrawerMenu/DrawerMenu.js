import React from "react";
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
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: "#142f43",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  listItemIcon: { color: "orange", fontSize: 17 },
  link: {
    textDecoration: "none",
    color: "#ffffff8c",
    fontSize: "20px",
  },
  menuIcon: {
    color: "orange",
  },

  divider: { backgroundColor: "#ffffff8c" },
}));

const mobileLinks = [
  {
    icon: <BsFillPersonPlusFill />,
    to: "/subscribers",
    name: "Subscribers",
    tabsValue: 0,
  },
  {
    icon: <AiFillMail />,
    to: "/campaigns",
    name: "Campaigns",
    tabsValue: 1,
  },
  {
    icon: <AiFillHome />,
    to: "/",
    name: "Home",
    tabsValue: 2,
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

  const activeSelectedLink = (strOne, strTwo) =>
    window.location.href.indexOf(strOne) > -1
      ? strOne
      : window.location.href.indexOf(strTwo) > -1
      ? strTwo
      : "";

  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List className={classes.list}>
          {mobileLinks.map(({ icon, to, name, tabsValue }) => {
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
                      to === activeSelectedLink("/subscribers", "/campaigns")
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
        </List>
      </Drawer>
      <IconButton
        className={classes.menuIcon}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {!openDrawer ? <MenuIcon /> : <MenuOpenIcon />}
      </IconButton>
    </>
  );
}

export default DrawerMenu;
