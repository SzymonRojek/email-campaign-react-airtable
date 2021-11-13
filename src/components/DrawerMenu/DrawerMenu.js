import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: "none",
    color: "#142f43",
    fontSize: "20px",
  },
  icon: {
    color: "white",
  },
}));

const mobileLinks = [
  { to: "/subscribers", name: "Subscribers", tabsValue: 0 },
  { to: "/campaigns", name: "Campaigns", tabsValue: 1 },
  { to: "/", name: "Home", tabsValue: 2 },
];

function DrawerMenu({ setTabsValue }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {mobileLinks.map(({ to, name, tabsValue }) => (
            <>
              <ListItem onClick={() => setOpenDrawer(false)}>
                <ListItemText>
                  <Link
                    to={to}
                    className={classes.link}
                    onClick={() => setTabsValue(tabsValue)}
                  >
                    {name}
                  </Link>
                </ListItemText>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        className={classes.icon}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerMenu;
