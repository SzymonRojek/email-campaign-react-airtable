import React from "react";
import { useEffect, useState } from "react";
import { AppBar, Typography, Tabs, Tab, Toolbar } from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
// root: {
//   backgroundColor: theme.palette.background.paper,
//   width: 500,
// },
// indicator: {
//   background: "yellow",
//   borderBottom: "2px solid",
// },
// tabs: {
// "& button[aria-selected='true']": {
//   border: "5px solid red"
// }
// "& button": {
//   padding: 5,
//   borderBottom: 2,
// },
// "& button[aria-selected='true']": {
//   position: "relative",

//   "&:before": {
//     content: '""',
//     position: "absolute",
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0,
//     background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//     zIndex: 0,
// }));

const checkUrl = (string) => window.location.href.indexOf(string) > -1;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: 20,
  },
  title: {
    fontSize: 30,
    paddingTop: 20,
    margin: "0 0 10px 20px",
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
      paddingTop: 20,
      margin: "0 0 10px 20px",
    },
  },
  headerOptions: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
}));

function NavBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickTab = (e, newValue) => {
    return setValue(newValue);
  };

  const navigateLinksOnReload = (value) => {
    value === 0
      ? navigate("/subscribers")
      : value === 1
      ? navigate("/campaigns")
      : navigate("/");
  };

  useEffect(() => {
    navigateLinksOnReload(value);
  }, []);

  // const menuItems = [
  //   { id: 1, menuTitle: "Home", pageURL: "/" },
  //   {
  //     id: 2,
  //     menuTitle: "Campaigns",
  //     pageURL: "/campaigns",
  //   },
  //   {
  //     id: 3,
  //     menuTitle: "Subscribers",
  //     pageURL: "/subscribers",
  //   },
  // ];

  const menuItems = [
    { to: "/subscribers", name: "Subscribers" },
    { to: "/campaigns", name: "Campaigns" },
    { to: "/", exact: true, name: "Home" },
  ];

  const handleTabClick = (pageURL) => navigate(pageURL);
  const handleMenuClick = (pageURL) => {
    navigate(pageURL);
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar color="primary">
        <Toolbar>
          <Typography className={classes.title}>
            <GoMailRead />
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {menuItems.map((menuItem) => {
                  const { name, to } = menuItem;
                  return (
                    <MenuItem onClick={() => handleMenuClick(to)}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          ) : (
            <div className={classes.headerOptions}>
              <Tabs
                onChange={handleClickTab}
                indicatorColor="secondary"
                // className={classes.tabs}
                // classes={{ indicator: classes.indicator }}
                value={value}
              >
                <Tab
                  icon={<BsFillPersonPlusFill />}
                  disableRipple
                  label="subscribers"
                  onClick={() => handleTabClick("/subscribers")}
                />

                <Tab
                  icon={<AiFillMail />}
                  disableRipple
                  label="campaigns"
                  onClick={() => handleTabClick("/campaigns")}
                />

                <Tab
                  icon={<AiFillHome />}
                  disableRipple
                  label="home"
                  onClick={() => handleTabClick("/")}
                />
              </Tabs>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
