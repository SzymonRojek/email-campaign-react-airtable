import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import { usePopup } from "popupContext.js";

const styles = {
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 0 25px 0",
  },
  dialogTitleTwo: { textAlign: "center" },
  span: { color: "crimson" },
  button: { color: "white" },
};

const ConfirmPopup = () => {
  const { isOpenConfirmPopup, text, closeConfirmPopup, actionPopup } =
    usePopup();

  return (
    <Dialog open={isOpenConfirmPopup} maxWidth="sm">
      {text.titleOne && (
        <>
          <DialogTitle>
            <p
              style={{
                color: "green",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {text.titleOne}
            </p>
          </DialogTitle>
          <DialogContent>
            <DialogContent dividers>
              <p style={{ fontSize: 18, textAlign: "center" }}>
                {text.description}
              </p>

              <p style={{ fontSize: 18, textAlign: "center" }}>
                {text.additionalText}
              </p>
            </DialogContent>
          </DialogContent>
        </>
      )}
      <DialogTitle style={styles.dialogTitleTwo}>
        <p>
          {text.titleTwo}
          <span style={{ color: "crimson" }}> {text.titleItem} </span> ?
        </p>
      </DialogTitle>
      <DialogContent dividers style={styles.dialogContent}>
        <Button
          variant="contained"
          color="error"
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

// ConfirmPopup.propTypes = {
//   openConfirmPopup: PropTypes.bool.isRequired,
//   setOpenConfirmPopup: PropTypes.func.isRequired,
//   handleActionPopup: PropTypes.func.isRequired,
//   contentPopup: PropTypes.object.isRequired,
// };

export default ConfirmPopup;
