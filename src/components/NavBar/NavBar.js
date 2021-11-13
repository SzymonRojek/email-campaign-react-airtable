import { useState } from "react";
import {
  AppBar,
  Typography,
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
import { Link } from "react-router-dom";

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

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     marginLeft: 20,
//   },
//   logoIcon: {
//     paddingTop: 20,
//     margin: "0 0 10px 20px",
//     fontSize: 30,
//     color: "orange",
//     [theme.breakpoints.down("xs")]: {
//       flexGrow: 1,
//       paddingTop: 20,
//       margin: "0 0 10px 20px",
//     },
//     cursor: "pointer",
//   },
//   headerOptions: {
//     display: "flex",
//     flex: 1,
//     justifyContent: "space-evenly",
//     paddingBottom: 20,
//   },
// }));

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#142f43",
  },
  navLinksContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    padding: "10px 0 20px 0",
  },
  logo: {
    fontSize: 30,
    color: "orange",
    cursor: "pointer",
    marginRight: 20,
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
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

function NavBar() {
  const [value, setValue] = useState(2);
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const handleClickTab = (e, newValue) => {
    return setValue(newValue);
  };

  return (
    <div>
      <AppBar className={classes.container} position="static">
        <CssBaseline />
        <Toolbar>
          <Typography className={classes.logo}>
            <GoMailRead />
          </Typography>

          {isMobile ? (
            <DrawerMenu />
          ) : (
            <div className={classes.navLinksContainer}>
              <StyledTabs onChange={handleClickTab} value={value}>
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

export default NavBar;
