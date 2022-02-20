import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Tab,
  Toolbar,
  CssBaseline,
  useMediaQuery,
} from "@material-ui/core";
import { MdPeopleAlt } from "react-icons/md";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";

import { usePopupContext } from "contexts/popupContextProvider";
import { StyledTabs } from "./StyledTabs";
import { MobileNavigation } from "./MobileNavigation";
import Logo from "../../../img/logo.svg";
import { LogFormButton } from "components/LogFormButton";

const mainNavigationLinks = [
  {
    icon: <MdPeopleAlt style={{ color: "orange", fontSize: 17 }} />,
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
  tabsRoot: {
    height: 3,
  },
  container: {
    position: "fixed",
    display: "grid",
    gridTemplateColumns: "120px 1fr 120px",
    top: 0,
    minHeight: "5vh",
    width: "100%",
    backgroundColor: "#142f43",
    padding: "20px 50px",
    boxShadow: "0 4px 2px -2px rgba(0, 0, 0, .2)",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  logoContainer: {
    [theme.breakpoints.up("md")]: {
      width: 50,
      height: 50,
    },
    [theme.breakpoints.down("sm")]: {
      width: 40,
      height: 40,
      marginBottom: 8,
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: 18,
    letterSpacing: 2,
    "&:first-child": {
      marginLeft: theme.spacing(7),
      marginRight: theme.spacing(7),
    },
    "&:last-child": {
      padding: "0 40px",
    },
  },
  logOutButton: {
    "&.MuiButton-root": {
      maxWidth: 120,
      padding: "10px 20px",
      fontSize: 16,
      fontWeight: "bold",
      color: "#142f43",
      backgroundColor: "orange",
      textTransform: "uppercase",
      border: "none",
      borderRadius: 3,
      cursor: "pointer",
      transition: "all .3s ease",

      "&:hover": {
        backgroundColor: "#ca880e",
        color: "rgb(221, 220, 220)",
        transform: "translateY(-2px)",
      },

      "&:active": {
        transform: "translateY(2px)",
      },
    },
  },
}));

function MainNavigation() {
  const theme = useTheme();
  const classes = useStyles();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLogIn, setIsLogIn, setStatusLog, tabsValue, setTabsValue } =
    usePopupContext();

  const handleClickTab = (e, newTabsValue) => setTabsValue(newTabsValue);

  useEffect(() => {
    if (pathname === "/subscribers") {
      setTabsValue(0);
    } else if (pathname === "/campaigns") {
      setTabsValue(1);
    } else {
      setTabsValue(2);
    }
  }, [pathname]);

  const handleChangeStates = () => {
    const timeID = setTimeout(() => {
      setTabsValue(2);
      navigate("/");
      setIsLogIn(false);
      setStatusLog("loadingIn");
    }, 2_000);

    return () => clearTimeout(timeID);
  };

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
          <MobileNavigation />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                    disabled={!isLogIn ? true : false}
                  />
                ))}
              </StyledTabs>
            </div>
            <LogFormButton
              aria-label="log out button"
              label="log out"
              onClick={() => {
                setStatusLog("loadingOut");
                handleChangeStates();
              }}
              className={classes.logOutButton}
              disabled={!isLogIn ? true : false}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

MainNavigation.propTypes = {
  tabsValue: PropTypes.number,
  setTabsValue: PropTypes.func,
  setIsLogIn: PropTypes.func,
  setStatusLog: PropTypes.func,
};

export default MainNavigation;
