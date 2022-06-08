import PropTypes from "prop-types";
import { Container, Box, Grid } from "@material-ui/core";
import { AppBar, Typography } from "@material-ui/core";
import { Link } from "@mui/material";
import { BsGithub } from "react-icons/bs";

import { useStyles } from "./styles";

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
