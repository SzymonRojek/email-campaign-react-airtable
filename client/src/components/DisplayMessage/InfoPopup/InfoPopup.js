import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import { usePopup } from "popupContext";

const styles = {
  titleContainer: { display: "flex" },
  title: { flexGrow: 1 },
  infoText: { color: "green", fontSize: 16 },
};

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("xs")]: {
    button: {
      maxWidth: "28px",
      maxHeight: "28px",
      minWidth: "28px",
      minHeight: "28px",
    },
    buttonText: {
      fontSize: 12,
      color: "white !important",
    },
    heading: { fontSize: 18 },
    contentText: { fontSize: 15 },
  },
  [theme.breakpoints.up("sm")]: {
    button: {
      height: 35,
      color: "white !important",
    },

    heading: { fontSize: 25 },
    contentText: { fontSize: 20 },
    paper: {
      maxWidth: 500,
    },
  },
}));

const InfoPopup = () => {
  const classes = useStyles();
  const { isOpenInfoPopup, closeInfoPopup, text } = usePopup();

  return (
    <Dialog open={isOpenInfoPopup} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <div style={styles.titleContainer}>
          <p style={styles.title} className={classes.heading}>
            {text.title}
          </p>
          <Button
            aria-label="close"
            className={classes.button}
            variant="contained"
            color={text.colorButton}
            onClick={() => {
              closeInfoPopup();
              // if (contentPopup.switch) return contentPopup.switch;
            }}
          >
            <span className={classes.buttonText}>close</span>
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p className={classes.contentText}>{text.paragraph}</p>

        {/* <p style={styles.infoText}>{text.additionalText}</p> */}
      </DialogContent>
    </Dialog>
  );
};

// const InfoPopup = ({ openInfoPopup, setOpenInfoPopup, contentPopup }) => {
//   const classes = useStyles();
//   const { isOpenConfirmPopup, text, closeConfirmPopup, actionPopup } = usePopup();

//   return (
//     <Dialog classes={{ paper: classes.paper }}>
//       <DialogTitle>
//         <div style={styles.titleContainer}>
//           <p style={styles.title} className={classes.heading}>
//             {contentPopup.title}
//           </p>
//           <Button
//             aria-label="close"
//             className={classes.button}
//             variant="contained"
//             color={contentPopup.colorButton}
//             onClick={() => {
//               setOpenInfoPopup(false);
//               if (contentPopup.switch) return contentPopup.switch;
//             }}
//           >
//             <span className={classes.buttonText}>close</span>
//           </Button>
//         </div>
//       </DialogTitle>
//       <DialogContent dividers>
//         <p className={classes.contentText}>{contentPopup.text}</p>
//         <p style={styles.infoText}>{contentPopup.additionalText}</p>
//       </DialogContent>
//     </Dialog>
//   );
// };

InfoPopup.propTypes = {
  openInfoPopup: PropTypes.bool.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  contentPopup: PropTypes.object.isRequired,
};

export default InfoPopup;
