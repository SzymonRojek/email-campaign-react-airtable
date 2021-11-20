import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const ConfirmPopup = ({
  openConfirmPopup,
  setOpenConfirmPopup,
  handleRemoveItem,
  contentPopup,
}) => {
  return (
    <Dialog open={openConfirmPopup} maxWidth="sm">
      <DialogTitle>
        <div>
          <Typography variant="h6" p={2}>
            Are you sure you want to remove
            <span style={{ color: "crimson" }}> {contentPopup.title}</span> ?
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
          onClick={() => handleRemoveItem()}
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
