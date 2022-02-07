import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@mui/material";
import { Container, Box, Grid } from "@mui/material";
import { SiAirtable } from "react-icons/si";

import peopleImg from "img/people.svg";
import computerImg from "img/computer.svg";
import envelopeImg from "img/envelope.svg";

const style = {
  box: {
    padding: "40px 16px 40px 32px",
    maxWidth: 1224,
    margin: "0 5px",
    color: "#142f43",
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    borderRadius: 6,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    MozBackdropFfilter: "blur(20px)",
  },
  link: {
    padding: "0 10px",
    color: "#142f43",
    fontWeight: "bold",
  },
  linkReadMe: {
    color: "orange",
  },
  airtableIcon: {
    color: "orange",
  },
};

const useStyles = makeStyles((theme) => ({
  peopleImg: {
    maxWidth: 170,
    alignItems: "center",
  },
  envelopeImg: {
    display: "none",
    maxWidth: 100,
    paddingTop: 40,
    [theme.breakpoints.up("md")]: {
      display: "inline-block",
    },
    "@media (min-width:1239px)": {
      paddingTop: 60,
    },
  },

  "@media (min-width:960px)": {
    container: {
      marginTop: 240,
    },
    computerImg: {
      alignItems: "center",
    },
  },
  "@media (max-width:780px)": {
    container: {
      marginTop: 100,
    },
    computerImg: {
      maxWidth: 300,
    },
  },
  "@media (min-width:780px)": {
    container: {
      marginTop: 160,
    },
    computerImg: {
      minWidth: 100,
      maxWidth: 400,
    },
  },
  mainHeading: {
    color: "orange",
    backgroundColor: "#142f43",
    padding: 30,
    "@media (min-width:800px)": {
      maxWidth: "50%",
      fontSize: "3.5rem",
    },
  },
  secondHeading: {
    "@media (min-width:800px)": {
      fontSize: "2rem",
    },
  },
  thirdHeading: {
    color: "white",
    "@media (min-width:800px)": {
      fontSize: "1.5rem",
    },
  },
  paragraph: {
    color: "white",
    "@media (min-width:800px)": {
      fontSize: "1.3rem",
    },
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box boxShadow={10} style={style.box}>
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12}>
            <h1 className={classes.mainHeading}>Hello 👋</h1>
          </Grid>
          <Grid item sm={12} md={6} order={{ md: 4 }}>
            <h2 className={classes.secondHeading}>
              That's Email Campaign application. You don't have to send e-mails
              separately. Now you can send one email to all active subscribers.
            </h2>
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              justify="center"
            >
              <img
                src={envelopeImg}
                alt="envelope"
                className={classes.envelopeImg}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} order={{ md: 4 }}>
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              justify="center"
            >
              <img
                src={computerImg}
                alt="computer img and envelopes"
                className={classes.computerImg}
              />
            </Grid>
          </Grid>
          <Grid item order={{ md: 4 }}>
            <Grid container spacing={3}>
              <Grid item md={6}>
                <h3 className={classes.thirdHeading}>
                  The app is connected to the
                  <span style={{ display: "inline-block" }}>
                    <Link
                      href="https://airtable.com/"
                      target="_blank"
                      underline="hover"
                      style={style.link}
                    >
                      <SiAirtable style={style.airtableIcon} /> Airtable
                    </Link>
                  </span>
                  base. Easily brings all information together - organize,
                  connect and change them as needed.
                </h3>
              </Grid>
              <Grid item md={6}>
                <h3 className={classes.thirdHeading}>
                  Airtable base will provide its own <strong>rest API </strong>
                  to create, read, update, and delete any records.
                </h3>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} order={{ md: 5 }}>
            <Grid container spacing={3}>
              <Grid
                container
                item
                direction="column"
                alignItems="center"
                justify="center"
                xs={12}
                md={2}
              >
                <img
                  src={peopleImg}
                  alt="people and envelopes"
                  className={classes.peopleImg}
                />
              </Grid>
              <Grid item md={10}>
                <p className={classes.paragraph}>
                  Add new subscriber, wait for an admin confirmation to get an
                  active status and get more their details. Finally create an
                  email campaign and send it to all your active subscribers just
                  by one <strong>simple click</strong>!
                </p>
              </Grid>

              <Grid item>
                <p className={classes.paragraph}>
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
                </p>
              </Grid>

              <Grid item>
                <p className={classes.paragraph}>Thank you 🙏</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
