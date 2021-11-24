import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const InfoPopup = ({ openInfoPopup, setOpenInfoPopup, contentPopup }) => (
  <Dialog open={openInfoPopup} maxWidth="sm">
    <DialogTitle>
      <div style={{ display: "flex" }}>
        <Typography variant="h6" p={2} style={{ flexGrow: 1 }}>
          {contentPopup.title}
        </Typography>
        <Button
          variant="contained"
          color={contentPopup.colorButton}
          onClick={() => {
            setOpenInfoPopup(false);
            if (contentPopup.switch) return contentPopup.switch;
          }}
        >
          X
        </Button>
      </div>
    </DialogTitle>
    <DialogContent dividers>
      <Typography p={2}>{contentPopup.text}</Typography>
    </DialogContent>
  </Dialog>
);

InfoPopup.propTypes = {
  openInfoPopup: PropTypes.bool.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  contentPopup: PropTypes.object.isRequired,
};

export default InfoPopup;
