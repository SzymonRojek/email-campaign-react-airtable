import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
  },
  typography: {
    padding: 35,
  },
}));

const ConfirmPopup = ({
  openConfirmPopup,
  setOpenConfirmPopup,
  subscribersData,
  campaignsData,
  selectedData,
  handleRemoveItem,
  contentPopup,
}) => {
  const classes = useStyles();

  const isItemFromSubscribersData = subscribersData.data
    ? !!subscribersData.data.filter((item) => item.id === selectedData).length
    : null;

  return (
    <Dialog
      open={openConfirmPopup}
      maxWidth="sm"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle>
        <div>
          <Typography variant="h6" className={classes.typography}>
            {contentPopup.title}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent
        dividers
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "30px 0 25px 0",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() =>
            isItemFromSubscribersData
              ? handleRemoveItem(subscribersData, "subscribers")
              : handleRemoveItem(campaignsData, "campaigns")
          }
        >
          YES
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenConfirmPopup(false)}
        >
          NO
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPopup;
