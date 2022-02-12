import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import { usePopup } from "popupContext";

const styles = {
  titleContainer: { display: "flex" },
  title: { flexGrow: 1 },
  infoText: { color: "green", fontSize: 16 },
};

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 500,
  },
  heading: { fontSize: 18 },
  contentText: { fontSize: 15 },
  smallButton: {
    "&.MuiButton-root": {
      height: 30,
      fontWeight: "bold",
      fontSize: 14,
    },
  },
  [theme.breakpoints.up("sm")]: {
    heading: { fontSize: 25 },
    contentText: { fontSize: 20 },
    smallButton: {
      "&.MuiButton-root": {
        height: 40,
        fontSize: 16,
      },
    },
  },
}));

const InfoPopup = () => {
  const classes = useStyles();
  const { isOpenInfoPopup, closeInfoPopup, text, actionPopup } = usePopup();

  const handleChangeRoute = () => actionPopup?.change && actionPopup.change();

  return (
    <Dialog open={isOpenInfoPopup} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <div style={styles.titleContainer}>
          <p style={styles.title} className={classes.heading}>
            {text.title}
          </p>
          <Button
            aria-label="close"
            className={classes.smallButton}
            variant="contained"
            color={text.colorButton}
            onClick={() => {
              handleChangeRoute();
              closeInfoPopup();
            }}
          >
            x
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p className={classes.contentText}>{text.additionalText}</p>
        <p className={classes.contentText}>{text.mainText}</p>
      </DialogContent>
    </Dialog>
  );
};

export default InfoPopup;
