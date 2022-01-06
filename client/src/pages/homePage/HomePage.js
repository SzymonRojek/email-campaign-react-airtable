import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@mui/material";
import { Container, Box, Grid, Typography } from "@mui/material";
import { SiAirtable } from "react-icons/si";

import homeImg from "img/heroPlus.svg";
import homeEnvelope from "img/envelope.svg";

const style = {
  box: {
    padding: "0 16px 0 32px",
    maxWidth: 1224,
    margin: "auto",
    color: "#142f43",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 6,
    backdropFilter: "blur(35px)",
  },
  link: {
    color: "orange",
    padding: "0 10px",
  },
};

const useStyles = makeStyles((theme) => ({
  homeEnvelope: {
    maxWidth: 150,
    alignItems: "center",
  },
  "@media (min-width:960px)": {
    container: {
      marginTop: 40,
    },
    homeImg: {
      alignItems: "center",
    },
  },
  "@media (max-width:780px)": {
    container: {
      marginTop: 40,
    },
    homeImg: {
      maxWidth: 450,
    },
  },
  "@media (min-width:780px)": {
    container: {
      marginTop: 40,
    },
    homeImg: {
      minWidth: 100,
      maxWidth: 400,
    },
  },
  mainHeading: {
    color: "orange",
    backgroundColor: "#142f43",
    padding: 30,
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
      <Box boxShadow={3} style={style.box}>
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h1" md={12} className={classes.mainHeading}>
              Hello, there.
            </Typography>
          </Grid>
          <Grid item sm={12} md={6} order={{ md: 4 }}>
            <Typography variant="h2" paragraph>
              This is the <strong>Email Campaign </strong>
              application. You can write @mail to all your subscribers just by
              one CLICK - easy peasy!
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} order={{ md: 4 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <img src={homeImg} alt="campaign" className={classes.homeImg} />
            </Grid>
          </Grid>
          <Grid item order={{ md: 4 }}>
            <Grid container spacing={3}>
              <Grid item md={6}>
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
              <Grid item md={6}>
                <Typography variant="h3">
                  Airtable base will provide its own <strong>rest API </strong>
                  to create, read, update, and delete any records.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            order={{ md: 5 }}
            style={{ padding: "40px 16px 20px 32px" }}
          >
            <Grid container spacing={3}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                xs={12}
                md={2}
              >
                <img
                  src={homeEnvelope}
                  alt="envelope"
                  className={classes.homeEnvelope}
                />
              </Grid>
              <Grid item md={10} style={{ paddingRight: 0 }}>
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
