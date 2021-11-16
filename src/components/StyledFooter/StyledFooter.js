import { Container, Box, Grid } from "@material-ui/core";
import { AppBar, Typography } from "@material-ui/core";
import { Link } from "@mui/material";
import { BsGithub } from "react-icons/bs";

const appBarStyles = {
  marginTop: "auto",
  backgroundColor: "#142f43",
  color: "#ffffff8c",
  zIndex: -1,
};

const iconStyles = {
  fontSize: 25,
  cursor: "pointer",
  color: "orange",
};

const StyledFooter = () => (
  <footer>
    <AppBar position="static" color="primary" style={appBarStyles}>
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
              <Typography variant="body1">
                Coded By Szymon Rojek © 2021
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Link href="https://github.com/SzymonRojek" target="_blank">
                <BsGithub style={iconStyles} />
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AppBar>
  </footer>
);

export default StyledFooter;
