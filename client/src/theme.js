import { createTheme } from "@material-ui/core/styles";

const theme = createTheme();

theme.typography.h1 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
};

theme.typography.h2 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.8rem",
  },
};

theme.typography.h3 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.4rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.7rem",
  },
};

theme.typography.body2 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.5rem",
  },
};

export default theme;
