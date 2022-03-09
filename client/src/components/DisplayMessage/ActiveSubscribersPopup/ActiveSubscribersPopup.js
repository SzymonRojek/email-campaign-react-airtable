import { useState, useEffect, useCallback, useMemo } from "react";
import { Typography } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  checkboxClasses,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import api from "api";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useQuery } from "react-query";

const styles = {
  dialogContent: {
    display: "flex",
    justifyContent: "space-around",
    padding: 20,
  },
  checkbox: {
    [`&, &.${checkboxClasses.checked}`]: {
      transform: "scale(1.1)",
      color: "orange",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 20,
    fontWeight: 600,
    textTransform: "uppercase",
    color: "green",
  },
  textInformation: {
    fontSize: 16,
  },
  mainButton: {
    "&.MuiButton-root": {
      marginBottom: 20,
      padding: "8px",
      minWidth: 180,
      fontSize: 16,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  },
  smallButton: {
    "&.MuiButton-root": { fontWeight: "bold", fontSize: 16 },
  },
  [theme.breakpoints.up("sm")]: {
    heading: { fontSize: 30 },
    textInformation: {
      fontSize: 20,
    },
    mainButton: {
      "&.MuiButton-root": {
        marginBottom: 40,
        padding: 15,
        fontSize: 18,
      },
    },
  },
}));

const ActiveSubscribersPopup = ({
  openListActiveSubscribers,
  closeListActiveSusbcribers,
}) => {
  const classes = useStyles();

  const { data: subscribers } = useQuery("subscribers", api.fetchItems, {
    meta: {
      myMessage: "Cannot get subscribers list:",
    },
  });
  const { setFinalSelectedActiveSubscribers } = useGlobalStoreContext();

  const filteredActiveSubscribers = useMemo(
    () =>
      subscribers
        ? subscribers.filter(
            (subscriber) => subscriber.fields.status === "active"
          )
        : [],
    [subscribers]
  );

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
      setFinalSelectedActiveSubscribers(selectedActiveSubscribers);
    }
  }, [selectedActiveSubscribers, setFinalSelectedActiveSubscribers]);

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
              className={classes.smallButton}
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
            className={classes.mainButton}
            variant="contained"
            color="error"
            onClick={() => handleRemoveChecked()}
          >
            <span className={classes.buttonText}>uncheck all</span>
          </Button>
        ) : (
          <Button
            aria-label="close"
            className={classes.mainButton}
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
          <Typography variant="body1" className={classes.textInformation}>
            {selectedActiveSubscribers.length === 0
              ? "Please select from the list"
              : selectedActiveSubscribers.length === 1
              ? `Selected 1 subscriber`
              : `Selected ${selectedActiveSubscribers.length} subscribers`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            aria-label="ok"
            className={classes.smallButton}
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
