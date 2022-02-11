import PropTypes from "prop-types";
import { Container, Box, Grid } from "@material-ui/core";
import { AppBar, Typography } from "@material-ui/core";
import { Link } from "@mui/material";
import { BsGithub } from "react-icons/bs";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "absolute",
    bottom: 0,
    minHeight: "5vh",
    color: "#ffffff8c",
    backgroundColor: "#142f43",
  },
  icon: {
    fontSize: 25,
    color: "orange",
    cursor: "pointer",
    zIndex: -1,
  },
  footer: { marginBottom: 180, zIndex: 1, textAlign: "center" },
  label: {
    [theme.breakpoints.up("sm")]: {
      fontSize: 20,
    },
  },
}));

const StyledFooter = ({ label }) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Container maxWidth="md">
          <Box p={3}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography variant="body1" className={classes.label}>
                  {label}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Link href="https://github.com/SzymonRojek" target="_blank">
                  <BsGithub className={classes.icon} />
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </AppBar>
    </footer>
  );
};

StyledFooter.propTypes = {
  label: PropTypes.string,
};

export default StyledFooter;
