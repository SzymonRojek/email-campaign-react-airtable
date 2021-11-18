import { Container, Box, Grid, Typography } from "@mui/material";

import homeImg from "../../img/image-home.svg";

const boxStyle = {
  maxWidth: 1224,
  margin: "auto",
  color: "#ffffff8c",
  backgroundColor: "#142f43",
  borderRadius: 6,
};

const Home = () => {
  return (
    <Container>
      <Box boxShadow={3} p={4} style={boxStyle}>
        <Grid container direction="row" spacing={4}>
          <Grid item sm={12} xs={6} md={6}>
            <Typography
              variant="h1"
              color="textPrimary"
              gutterBottom
              style={{ color: "orange" }}
              md={12}
            >
              Hello, there.
            </Typography>
          </Grid>
          <Grid item sm={6} md={6}>
            <Typography variant="h4" paragraph>
              This is a personalize <strong>Email Campaign </strong>
              application. You can write @mail to all subscribers just by one
              CLICK - easy peasy!
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12} md={6} order={{ md: 4 }}>
            <Grid container>
              <Grid item sm={12} xs={12}>
                <img src={homeImg} alt="campaign" style={{ height: "auto" }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} order={{ md: 3 }}>
            <Grid container>
              <Typography variant="h5" paragraph>
                Add new subscriber, wait for an admin confirmation to get an
                active status, get more their details. Finally create an email
                campaign and send it to all your subscribers by one simple
                click!
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} order={{ md: 5 }}>
            <Grid container>
              <Typography variant="h6" paragraph>
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
