import { Dialog, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import { useConfirmModalState } from "contexts/ConfirmModalContext";

import { styles, useStyles } from "./styles";

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
