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
  { to: "/subscribers", name: "Subscribers" },
  { to: "/campaigns", name: "Campaigns" },
  { to: "/", name: "Home" },
];

function DrawerMenu() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {mobileLinks.map((link) => (
            <>
              <ListItem onClick={() => setOpenDrawer(false)}>
                <ListItemText>
                  <Link to={link.to} className={classes.link}>
                    {link.name}
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
