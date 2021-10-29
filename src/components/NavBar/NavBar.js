import { useEffect, useState } from "react";
import { AppBar, Typography, Tabs, Tab, Toolbar } from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
  indicator: {
    background: "none",
  },
  tabs: {
    "& button[aria-selected='true']": {
      position: "relative",

      "&:before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        zIndex: 0,
      },

      "& > *": { zIndex: 0 },
      // "& > .MuiTab-wrapper": {
      //   height: "100%",
      // },
    },
  },
}));

function NavBar() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [value, setValue] = useState(2);

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

  const handleTabClick = (pageURL) => navigate(pageURL);

  return (
    <>
      <AppBar color="primary">
        <Toolbar>
          <Typography>
            <GoMailRead />
          </Typography>

          <Tabs
            onChange={handleClickTab}
            indicatorColor="secondary"
            className={classes.tabs}
            classes={{ indicator: classes.indicator }}
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
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
