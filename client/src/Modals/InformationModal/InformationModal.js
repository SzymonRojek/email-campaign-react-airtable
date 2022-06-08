import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

import { styles, useStyles } from "./styles";
import { useInformationModalState } from "contexts/InformationModalContext";

const InformationModal = () => {
  const classes = useStyles();

  const {
    isOpenInformationModal,
    informationModalText: { title, additionalText, message },
    informationModalProps: { colorButton, onClose },
  } = useInformationModalState();

  return (
    <Dialog open={isOpenInformationModal} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <div style={styles.titleContainer}>
          <p style={styles.title} className={classes.heading}>
            {title}
          </p>
          <Button
            aria-label="close"
            className={classes.smallButton}
            variant="contained"
            color={colorButton}
            onClick={() => onClose()}
          >
            x
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p className={classes.contentText}>{additionalText}</p>
        <p className={classes.contentText}>{message}</p>
      </DialogContent>
    </Dialog>
  );
};

export default InformationModal;
