import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const style = {
  dialog: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 0 25px 0",
  },
  span: { color: "crimson" },
};

const ConfirmPopup = ({
  openConfirmPopup,
  setOpenConfirmPopup,
  handleRemoveItem,
  contentPopup,
}) => (
  <Dialog open={openConfirmPopup} maxWidth="sm">
    <DialogTitle>
      <div>
        <Typography variant="h6" p={2}>
          Are you sure you want to remove
          <span style={style.span}> {contentPopup.title}</span> ?
        </Typography>
      </div>
    </DialogTitle>
    <DialogContent dividers style={style.dialog}>
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

ConfirmPopup.propTypes = {
  openConfirmPopup: PropTypes.bool.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  handleRemoveItem: PropTypes.func.isRequired,
  contentPopup: PropTypes.object.isRequired,
};

export default ConfirmPopup;
