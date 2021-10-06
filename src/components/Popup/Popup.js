import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
  },
}));

const Popup = ({ openPopup, setOpenPopup, textContentPopup }) => {
  const classes = useStyles();

  const handleClosePopup = () => setOpenPopup(false);

  return (
    <Dialog
      open={openPopup}
      maxWidth="sm"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {textContentPopup.title}
          </Typography>
          <Button variant="contained" color="error" onClick={handleClosePopup}>
            X
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Typography>{textContentPopup.text}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
