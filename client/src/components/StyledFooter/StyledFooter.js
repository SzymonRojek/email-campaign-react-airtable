import PropTypes from "prop-types";
import { Container, Box, Grid } from "@material-ui/core";
import { AppBar, Typography } from "@material-ui/core";
import { Link } from "@mui/material";
import { BsGithub } from "react-icons/bs";

const style = {
  appBar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#142f43",
    color: "#ffffff8c",
    minHeight: "5vh",
  },
  icon: {
    fontSize: 25,
    cursor: "pointer",
    color: "orange",
    zIndex: -1,
  },
  footer: { marginBottom: 180, zIndex: 1, textAlign: "center" },
};

const StyledFooter = ({ label }) => (
  <footer style={style.footer}>
    <AppBar position="static" color="primary" style={style.appBar}>
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
              <Typography variant="body1">{label}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Link href="https://github.com/SzymonRojek" target="_blank">
                <BsGithub style={style.icon} />
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AppBar>
  </footer>
);

StyledFooter.propTypes = {
  label: PropTypes.string.isRequired,
};

export default StyledFooter;
