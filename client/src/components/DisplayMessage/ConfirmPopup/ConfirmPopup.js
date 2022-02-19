import { Dialog, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";

import { usePopupContext } from "contexts/popupContextProvider";

const styles = {
  containerText: { padding: "35px 25px" },
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 0 25px 0",
  },
  button: { color: "white", fontWeight: "bold" },
};

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("xs")]: {
    addiotnalText: {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
      margin: 0,
    },
    text: { fontSize: 18, textAlign: "center", padding: "10px 0", margin: 0 },
  },
  [theme.breakpoints.up("sm")]: {
    additionalText: {
      fontSize: 25,
      textAlign: "center",
      fontWeight: "bold",
      padding: 10,
      margin: 0,
    },
    text: { fontSize: 25, textAlign: "center", padding: "10px 0", margin: 0 },
    paper: {
      maxWidth: 500,
    },
  },
}));

const ConfirmPopup = () => {
  const classes = useStyles();
  const { isOpenConfirmPopup, text, closeConfirmPopup, actionPopup } =
    usePopupContext();

  return (
    <Dialog open={isOpenConfirmPopup} classes={{ paper: classes.paper }}>
      <div style={styles.containerText}>
        <p className={classes.additionalText}>{text.additionalText}</p>
        {text.title && <p className={classes.text}>{text.title}</p>}

        <p className={classes.text}>{text.question}</p>
      </div>
      <DialogContent dividers style={styles.dialogContent}>
        <Button
          variant="contained"
          color="error"
          style={styles.button}
          onClick={() => {
            actionPopup.change();
            closeConfirmPopup();
          }}
        >
          YES
        </Button>
        <Button
          variant="contained"
          color="success"
          style={styles.button}
          onClick={() => closeConfirmPopup()}
        >
          NO
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPopup;
