import { useState, useEffect, useCallback } from "react";
import { Typography } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import { usePopup } from "popupContext.js";
import { useAPI } from "../../../APiContextProvider";

const styles = {
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: 20,
  },
  checkbox: {
    transform: "scale(1.1)",
    color: "orange",
    "&.Mui-checked": {
      color: "orange",
    },
  },
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
  },
  [theme.breakpoints.up("sm")]: {
    button: {
      height: 35,
      color: "white !important",
    },
    heading: { fontSize: 25 },
  },
}));

const ActiveSubscribersPopup = ({
  openListActiveSubscribers,
  closeListActiveSusbcribers,
}) => {
  const classes = useStyles();
  const { filteredActiveSubscribers } = useAPI();

  const { handleActionPopup } = usePopup();

  const [checked, setChecked] = useState([false]);

  const [allChecked1, setAllChecked1] = useState(false);
  const [allChecked2, setAllChecked2] = useState(false);

  const handleCheckedAll1 = () => setAllChecked1((prev) => !prev);

  const lengthActiveSubscribers = filteredActiveSubscribers.length;

  const stateForCheckboxes = useCallback(
    (el) =>
      filteredActiveSubscribers
        ? new Array(lengthActiveSubscribers).fill(el)
        : [false],
    [filteredActiveSubscribers, lengthActiveSubscribers]
  );

  useEffect(() => {
    setChecked(stateForCheckboxes(false));
  }, [stateForCheckboxes]);

  const [selectedActiveSubscribers, setSelectedActiveSubscribers] = useState(
    []
  );

  const handleOnChange = (position) => {
    const updatedChecked = checked.map((item, index) =>
      index === position ? !item : item
    );

    setChecked(updatedChecked);

    const updatedActiveSubscribers = updatedChecked.map(
      (stateCheckbox, index) =>
        stateCheckbox ? filteredActiveSubscribers[index] : null
    );

    setSelectedActiveSubscribers(updatedActiveSubscribers.filter(Boolean));
  };

  const handleRemoveChecked = () => {
    setAllChecked2((prev) => !prev);
    setAllChecked1(false);
  };

  useEffect(() => {
    if (allChecked2) {
      setChecked(stateForCheckboxes(false));
      setSelectedActiveSubscribers([]);
      setAllChecked2(false);
    }

    if (!selectedActiveSubscribers.length) {
      setAllChecked1(false);
    }
  }, [
    allChecked2,
    checked.length,
    selectedActiveSubscribers.length,
    stateForCheckboxes,
  ]);

  useEffect(() => {
    if (allChecked1) {
      setChecked(stateForCheckboxes(true));
      setSelectedActiveSubscribers(filteredActiveSubscribers);
    } else {
      setChecked(stateForCheckboxes(false));
      setSelectedActiveSubscribers([]);
    }
  }, [
    allChecked1,
    checked.length,
    filteredActiveSubscribers,
    stateForCheckboxes,
  ]);

  const getChoosenActiveSubscribers = useCallback(() => {
    if (selectedActiveSubscribers) {
      handleActionPopup(selectedActiveSubscribers);
    }
  }, [selectedActiveSubscribers, handleActionPopup]);

  useEffect(() => {
    getChoosenActiveSubscribers();
  }, [getChoosenActiveSubscribers]);

  return (
    <Dialog open={openListActiveSubscribers} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} justifyContent="flex-end" textAlign="right">
            <Button
              aria-label="close"
              className={classes.button}
              variant="contained"
              color="error"
              onClick={() => {
                closeListActiveSusbcribers(false);
                setSelectedActiveSubscribers([]);
              }}
            >
              <span className={classes.buttonText}>X</span>
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center" p={4}>
            <p style={styles.title} className={classes.heading}>
              Active Subscribers
            </p>
          </Grid>
        </Grid>
      </DialogTitle>

      <Grid container justifyContent="center" alignItems="center">
        {selectedActiveSubscribers.length >= 1 ? (
          <Button
            aria-label="remove"
            className={classes.button}
            style={{ minWidth: 180, marginBottom: 20 }}
            variant="contained"
            color="error"
            onClick={() => handleRemoveChecked()}
          >
            <span className={classes.buttonText}>uncheck all</span>
          </Button>
        ) : (
          <Button
            aria-label="close"
            className={classes.button}
            style={{ minWidth: 180, marginBottom: 20 }}
            variant="contained"
            color="success"
            onClick={() => handleCheckedAll1()}
          >
            <span className={classes.buttonText}>
              check all <span></span>
            </span>
          </Button>
        )}
      </Grid>

      <DialogContent dividers>
        <Grid container style={{ paddingLeft: 60 }}>
          {filteredActiveSubscribers.map((item, index) => (
            <Grid item xs={12} sm={6} key={`${item.fields.name}-${index}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked[index] ? checked[index] : false}
                    onChange={() => handleOnChange(index)}
                    name="subscriber"
                    defaultValue={false}
                    sx={styles.checkbox}
                  />
                }
                label={`${item.fields.name}  ${item.fields.surname}`}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <Grid
        container
        p={4}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Typography variant="body1">
            {selectedActiveSubscribers.length === 0
              ? "Please select from the list"
              : selectedActiveSubscribers.length === 1
              ? `Selected 1 Subscriber`
              : `Selected ${selectedActiveSubscribers.length} Subscribers`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            aria-label="ok"
            className={classes.button}
            variant="contained"
            color="success"
            onClick={() => closeListActiveSusbcribers(false)}
          >
            <span className={classes.buttonText}>ok</span>
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ActiveSubscribersPopup;
