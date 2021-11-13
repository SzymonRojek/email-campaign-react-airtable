import React from "react";
import { useEffect, useState } from "react";
import { AppBar, Typography, Tab, Toolbar } from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router";

import MenuIcon from "@material-ui/icons/Menu";
import { MenuItem, Menu, IconButton, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { StyledTabs } from "../StyledTabs";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: 20,
  },
  logoIcon: {
    paddingTop: 20,
    margin: "0 0 10px 20px",
    fontSize: 30,
    color: "orange",
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
      paddingTop: 20,
      margin: "0 0 10px 20px",
    },
    cursor: "pointer",
  },
  headerOptions: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    paddingBottom: 20,
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
      <AppBar style={{ backgroundColor: "#142f43" }}>
        <Toolbar>
          <Typography className={classes.logoIcon}>
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
                    <MenuItem onClick={() => handleMenuClick(to)} divider>
                      {name}
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          ) : (
            <div className={classes.headerOptions}>
              <StyledTabs
                TabIndicatorProps={{
                  style: {
                    background: "orange",
                    maxWidth: 130,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
                onChange={handleClickTab}
                value={value}
              >
                <Tab
                  icon={
                    <BsFillPersonPlusFill
                      style={{ color: "orange", fontSize: 17 }}
                    />
                  }
                  disableRipple
                  label="subscribers"
                  onClick={() => handleTabClick("/subscribers")}
                />

                <Tab
                  icon={
                    <AiFillMail style={{ color: "orange", fontSize: 17 }} />
                  }
                  disableRipple
                  label="campaigns"
                  onClick={() => handleTabClick("/campaigns")}
                />

                <Tab
                  icon={
                    <AiFillHome style={{ color: "orange", fontSize: 17 }} />
                  }
                  disableRipple
                  label="home"
                  onClick={() => handleTabClick("/")}
                />
              </StyledTabs>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
