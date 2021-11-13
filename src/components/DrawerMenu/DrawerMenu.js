import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
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
  link: {
    textDecoration: "none",
    color: "#ffffff8c",
    fontSize: "20px",
  },
  icon: {
    color: "white",
  },
  divider: { backgroundColor: "#ffffff8c" },
}));

const mobileLinks = [
  {
    icon: <BsFillPersonPlusFill style={{ color: "orange", fontSize: 17 }} />,
    to: "/subscribers",
    name: "Subscribers",
    tabsValue: 0,
  },
  {
    icon: <AiFillMail style={{ color: "orange", fontSize: 17 }} />,
    to: "/campaigns",
    name: "Campaigns",
    tabsValue: 1,
  },
  {
    icon: <AiFillHome style={{ color: "orange", fontSize: 17 }} />,
    to: "/",
    name: "Home",
    tabsValue: 2,
  },
];

function DrawerMenu({ setTabsValue }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List className={classes.list}>
          {mobileLinks.map(({ icon, to, name, tabsValue }) => (
            <div key={`key-${tabsValue}`}>
              <ListItem
                button
                key={`key-${tabsValue}`}
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
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
              <Divider className={classes.divider} />
            </div>
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
