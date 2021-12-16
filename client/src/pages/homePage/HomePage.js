import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@mui/material";
import { Container, Box, Grid, Typography } from "@mui/material";
import { SiAirtable } from "react-icons/si";

import homeImg from "img/graphic.svg";

const style = {
  box: {
    maxWidth: 1224,
    margin: "auto",
    color: "#ffffff8c",
    backgroundColor: "#142f43",
    borderRadius: 6,
  },
  link: {
    color: "orange",
    padding: "0 10px",
  },
};

const useStyles = makeStyles((theme) => ({
  "@media (min-width:960px)": {
    container: {
      marginTop: 40,
    },
    mainHeading: {
      padding: "100px",
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
  link: {
    color: "orange",
    padding: "0 10px",
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box boxShadow={3} p={4} style={style.box}>
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
              This is the <strong>Email Campaign </strong>
              application. You can write @mail to all your subscribers just by
              one CLICK - easy peasy!
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12} md={6} order={{ md: 4 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <img src={homeImg} alt="campaign" className={classes.homeImg} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} order={{ md: 3 }}>
            <Grid container spacing={3}>
              <Grid item>
                <Typography variant="h3">
                  The app is connected to the
                  <span style={{ display: "inline-block" }}>
                    <Link
                      href="https://airtable.com/"
                      target="_blank"
                      underline="hover"
                      style={style.link}
                    >
                      <SiAirtable /> Airtable
                    </Link>
                  </span>
                  base. Easily brings all information together - organize,
                  connect and change them as needed.
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3">
                  Airtable base will provide its own <strong>rest API </strong>
                  to create, read, update, and delete any records.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} order={{ md: 5 }}>
            <Grid container spacing={3}>
              <Grid item>
                <Typography variant="body2">
                  Add new subscriber, wait for an admin confirmation to get an
                  active status and get more their details. Finally create an
                  email campaign and send it to all your active subscribers just
                  by one <strong>simple click</strong>!
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">
                  If you would like to read the detailed description of the
                  application or just to get more information about used
                  technologies, please check out the
                  <Link
                    href="https://github.com/SzymonRojek/email-campaign-react-airtable"
                    target="_blank"
                    underline="hover"
                    style={style.link}
                  >
                    ReadMe
                  </Link>
                  file of this project.
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">Thanks! 🙏</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;