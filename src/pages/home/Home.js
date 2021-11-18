import { Container, Box, Grid, Typography } from "@mui/material";

import { makeStyles } from "@material-ui/core/styles";

import homeImg from "../../img/image-home.svg";

const boxStyle = {
  maxWidth: 1224,
  margin: "auto",
  color: "#ffffff8c",
  backgroundColor: "#142f43",
  borderRadius: 6,
};

const useStyles = makeStyles((theme) => ({
  "@media (min-width:960px)": {
    container: {
      marginTop: 40,
    },
  },
  "@media (max-width:600px)": {
    container: {
      marginTop: 40,
    },
    homeImg: {
      maxWidth: 200,
    },
  },
  mainHeading: {
    color: "orange",
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box boxShadow={3} p={4} style={boxStyle}>
        <Grid container direction="row" spacing={4}>
          <Grid item sm={12} xs={12} md={6}>
            <Typography
              variant="h1"
              gutterBottom
              md={12}
              className={classes.mainHeading}
            >
              Hello, there.
            </Typography>
          </Grid>
          <Grid item sm={6} md={6}>
            <Typography variant="h2" paragraph>
              This is a personalize <strong>Email Campaign </strong>
              application. You can write @mail to all subscribers just by one
              CLICK - easy peasy!
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12} md={6} order={{ md: 4 }}>
            <Grid container direction="row">
              <Grid item sm={12} xs={12}>
                <img src={homeImg} alt="campaign" className={classes.homeImg} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} order={{ md: 3 }}>
            <Grid container>
              <Typography variant="h3" paragraph>
                Add new subscriber, wait for an admin confirmation to get an
                active status, get more their details. Finally create an email
                campaign and send it to all your subscribers by one simple
                click!
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} order={{ md: 5 }}>
            <Grid container>
              <Typography variant="body2">
                If you want to get more information please read this description
                below:
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
