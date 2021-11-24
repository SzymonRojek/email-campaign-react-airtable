import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailsIcon from "@mui/icons-material/Details";
import { TableCell, TableRow, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "../../helpers";

const style = {
  paragraph: {
    padding: "8px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 80,
    display: "flex",
    justifyContent: "center",
  },
  icon: { marginLeft: 10, color: "white" },
  pending: { color: "orange" },
  blocked: { color: "#d32f2f" },
};
const useStyles = makeStyles((theme) => ({
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: "3px 10px",
    display: "inline-block",
  },
}));

const RowSubscriber = (props) => {
  const {
    subscriber,
    index,
    children,
    setSelectedData,
    handleSubscriberDetails,
    setOpenConfirmPopup,
    setContentPopup,
  } = props;

  const classes = useStyles();
  const location = useLocation();

  const setTextPopupByStatus = () =>
    subscriber.fields.status === "pending"
      ? setContentPopup({
          title: "Please wait...",
          text: (
            <>
              {capitalizeFirstLetter(subscriber.fields.name)}'s status is
              <span style={style.pending}>
                <strong> pending </strong>
              </span>
              at the moment - subscription has to be confirmed by an admin 🙂
            </>
          ),
          colorButton: "error",
        })
      : subscriber.fields.status === "blocked"
      ? setContentPopup({
          title: "Unfortunately...",
          text: (
            <>
              {capitalizeFirstLetter(subscriber.fields.name)}'s status is
              <span style={style.blocked}>
                <strong> blocked </strong>
              </span>
              - can not get an access to more details 🙁
            </>
          ),
          colorButton: "error",
        })
      : {};

  return (
    <TableRow
      key={`${subscriber.id}`}
      style={{ backgroundColor: isEven(index, "#F5F5F5") }}
    >
      {children}
      <TableCell>
        <Grid container alignItems="center">
          <Grid item>
            <Typography color="textSecondary" variant="subtitle1">
              {capitalizeFirstLetter(subscriber.fields.name)}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle1">
          {capitalizeFirstLetter(subscriber.fields.surname)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle1">
          {subscriber.fields.profession}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: getStatusColor(subscriber.fields.status),
              ...style.paragraph,
            }}
          >
            {subscriber.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle1">
          {getFormattedData(subscriber.createdTime)}
        </Typography>
      </TableCell>
      {location.pathname !== `/subscribers/${subscriber.id}` && (
        <>
          <TableCell>
            <Button
              aria-label="subscriber-details"
              color="success"
              variant="contained"
              startIcon={<DetailsIcon style={style.icon} />}
              onClick={() => {
                setSelectedData(subscriber);
                handleSubscriberDetails(subscriber);
                setTextPopupByStatus();
              }}
            />
          </TableCell>
          <TableCell>
            <Button
              key={location.key}
              aria-label="delete"
              color="error"
              variant="contained"
              startIcon={<DeleteIcon style={style.icon} />}
              onClick={() => {
                setOpenConfirmPopup(true);
                setSelectedData(subscriber);
                setContentPopup({
                  title: capitalizeFirstLetter(subscriber.fields.name),
                });
              }}
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

RowSubscriber.propTypes = {
  subscriber: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.object.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default RowSubscriber;
