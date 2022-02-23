import { Dialog, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useConfirmModalState } from "contexts/ConfirmModalContext";

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
      minWidth: 400,
      maxWidth: 500,
    },
  },
}));

const ConfirmModal = () => {
  const classes = useStyles();
  const {
    isOpenConfirmModal,
    confirmModalText: { message, additionalText, question },
    confirmModalProps: { onConfirm, onClose },
  } = useConfirmModalState();

  return (
    <Dialog open={isOpenConfirmModal} classes={{ paper: classes.paper }}>
      <div style={styles.containerText}>
        <p className={classes.additionalText}>{additionalText}</p>
        <p className={classes.text}>{message}</p>
        <p className={classes.text}>{question}</p>
      </div>
      <DialogContent dividers style={styles.dialogContent}>
        <Button
          variant="contained"
          color="error"
          style={styles.button}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          YES
        </Button>
        <Button
          variant="contained"
          color="success"
          style={styles.button}
          onClick={() => onClose()}
        >
          NO
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
