import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Tab,
  Toolbar,
  CssBaseline,
  useMediaQuery,
} from "@material-ui/core";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";

import { StyledTabs } from "./StyledTabs";
import { DrawerMenu } from "./DrawerMenu";
import Logo from "../../../img/logo.svg"; // remove dots!
import LogFormButton from "../../LogFormButton/LogFormButton";

const mainNavigationLinks = [
  {
    icon: <BsFillPersonPlusFill style={{ color: "orange", fontSize: 17 }} />,
    name: "Subscribers",
    to: "/subscribers",
  },
  {
    icon: <AiFillMail style={{ color: "orange", fontSize: 17 }} />,
    name: "Campaigns",
    to: "/campaigns",
  },
  {
    icon: <AiFillHome style={{ color: "orange", fontSize: 17 }} />,
    name: "Home",
    to: "/",
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    top: 0,
    minHeight: "5vh",
    width: "100%",
    backgroundColor: "#142f43",
    boxShadow: "0 4px 2px -2px rgba(0, 0, 0, .2)",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-between",
      minHeight: "5vh",
      padding: "10px 0 10px 20px",
    },
  },
  navLinksContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    padding: "10px 0 20px 0",
  },
  logoContainer: {
    [theme.breakpoints.up("md")]: {
      marginBottom: 10,
      width: 50,
      height: 50,
      marginRight: 90,
    },
    [theme.breakpoints.down("sm")]: {
      width: 40,
      height: 40,
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: 15,
    letterSpacing: 2,
    "&:first-child": {
      marginRight: theme.spacing(4),
    },
  },
}));

function MainNavigation({ tabsValue, setTabsValue, setLoginValue }) {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const handleClickTab = (e, newTabsValue) => setTabsValue(newTabsValue);

  useEffect(() => {
    const path = location.pathname;
    if (window.location.href.indexOf("subscribers") > -1 && tabsValue !== 0) {
      setTabsValue(0);
    } else if (
      window.location.href.indexOf("campaigns") > -1 &&
      tabsValue !== 1
    ) {
      setTabsValue(1);
    } else if (path === "/" && tabsValue !== 2) {
      setTabsValue(2);
    }
  }, []);

  return (
    <AppBar position="static">
      <CssBaseline />

      <Toolbar className={classes.container}>
        <div className={classes.logoContainer}>
          <Link to="/" onClick={() => setTabsValue(2)}>
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        {isSmallDevice ? (
          <DrawerMenu setTabsValue={setTabsValue} />
        ) : (
          <>
            <div className={classes.navLinksContainer}>
              <StyledTabs onChange={handleClickTab} value={tabsValue}>
                {mainNavigationLinks.map(({ icon, name, to }) => (
                  <Tab
                    key={name}
                    icon={icon}
                    disableRipple
                    label={name}
                    component={Link}
                    to={to}
                    className={classes.link}
                  />
                ))}
              </StyledTabs>
            </div>
            <LogFormButton label="log out" onClick={() => setLoginValue("")} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

MainNavigation.propTypes = {
  tabsValue: PropTypes.number.isRequired,
  setTabsValue: PropTypes.func.isRequired,
};

export default MainNavigation;
