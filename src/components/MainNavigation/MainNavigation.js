import { useEffect } from "react";
import {
  AppBar,
  Tab,
  Toolbar,
  CssBaseline,
  useMediaQuery,
} from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link, useLocation } from "react-router-dom";

import { StyledTabs } from "../StyledTabs";
import { DrawerMenu } from "../DrawerMenu";

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
    backgroundColor: "#142f43",
    [theme.breakpoints.down("xs")]: {
      padding: "10px 0",
    },
  },
  navLinksContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    padding: "10px 0 20px 0",
  },
  logoContainer: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  logo: {
    fontSize: 30,
    color: "orange",
    cursor: "pointer",
    marginRight: 20,
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: 15,
    letterSpacing: 2,
    padding: 0,
    "&:first-child": {
      marginRight: theme.spacing(4),
    },
  },
}));

function MainNavigation({ tabsValue, setTabsValue }) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const location = useLocation();

  const handleClickTab = (e, newTabsValue) => setTabsValue(newTabsValue);

  // keep same indicator tabs position on reload
  useEffect(() => {
    const path = location.pathname;
    if (window.location.href.indexOf("subscribers") > -1 && tabsValue !== 0)
      setTabsValue(0);
    else if (window.location.href.indexOf("campaigns") > -1 && tabsValue !== 1)
      setTabsValue(1);
    else if (path === "/" && tabsValue !== 2) setTabsValue(2);
  }, []);

  return (
    <div>
      <AppBar className={classes.container} position="static">
        <CssBaseline />
        <Toolbar>
          <div className={classes.logoContainer}>
            <Link to="/">
              <GoMailRead className={classes.logo} />
            </Link>
          </div>

          {isMobile ? (
            <DrawerMenu setTabsValue={setTabsValue} />
          ) : (
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
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MainNavigation;
