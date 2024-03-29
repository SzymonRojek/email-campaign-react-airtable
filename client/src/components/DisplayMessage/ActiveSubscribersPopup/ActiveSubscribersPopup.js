import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Button } from "@mui/material";

import { useStyles, styles } from "./styles";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import {
  handleUncheckedAll,
  handleCheckedAll,
  areSomeTruthy,
  countStateTruthy,
} from "./utilities";
import fetchData from "../../../services/fetchData";

const ActiveSubscribersPopup = ({
  openListActiveSubscribers,
  closeListActiveSusbcribers,
}) => {
  const classes = useStyles();

  const { data: subscribers } = useQuery("subscribers", fetchData, {
    meta: {
      myMessage: "Cannot get subscribers list:",
    },
  });

  const [checkedState, setCheckedState] = useState([]);
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

  const stateForCheckboxes = useCallback(
    (el) =>
      filteredActiveSubscribers &&
      new Array(filteredActiveSubscribers.length).fill(el),

    [filteredActiveSubscribers]
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const updatedActiveSubscribers = updatedCheckedState.map(
      (stateCheckbox, index) =>
        stateCheckbox ? filteredActiveSubscribers[index] : null
    );

    setFinalSelectedActiveSubscribers(updatedActiveSubscribers.filter(Boolean));
  };

  useEffect(() => {
    setCheckedState(stateForCheckboxes(true));
  }, [stateForCheckboxes]);

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
                setFinalSelectedActiveSubscribers([]);
                handleCheckedAll(setCheckedState, checkedState);
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
        {areSomeTruthy(checkedState) ? (
          <Button
            aria-label="unchecked"
            className={classes.mainButton}
            variant="contained"
            color="error"
            onClick={() => handleUncheckedAll(setCheckedState, checkedState)}
          >
            <span className={classes.buttonText}>uncheck all</span>
          </Button>
        ) : (
          <Button
            aria-label="checked"
            className={classes.mainButton}
            variant="contained"
            color="success"
            onClick={() => handleCheckedAll(setCheckedState, checkedState)}
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
                    checked={checkedState[index]}
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
            {countStateTruthy(checkedState) === 0
              ? "Please choose subscribers"
              : `Checked subscribers: ${countStateTruthy(checkedState)}`}
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
