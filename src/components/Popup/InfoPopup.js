import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const InfoPopup = ({ openInfoPopup, setOpenInfoPopup, contentPopup }) => {
  return (
    <Dialog open={openInfoPopup} maxWidth="sm">
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
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
        <Typography>{contentPopup.text}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default InfoPopup;
