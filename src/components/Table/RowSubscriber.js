import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailsIcon from "@mui/icons-material/Details";
import {
  TableCell,
  TableRow,
  Avatar,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "../../helpers";

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
    setIdClickedItem,
    handleSubscriberDetails,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;
  const classes = useStyles();

  const location = useLocation();

  const setTextPopupByStatus = () =>
    subscriber.fields.status === "pending"
      ? setContentPopup({
          title: "Please wait...",
          text: `${subscriber.fields.name}'s status is pending at the moment - subscription has to be confirmed by an admin.`,
          colorButton: "error",
        })
      : subscriber.fields.status === "blocked"
      ? setContentPopup({
          title: "Unfortunately...",
          text: `${subscriber.fields.name}'s status is blocked - can not get an access to more details.`,
          colorButton: "error",
        })
      : {};

  return (
    <TableRow
      key={`${subscriber.id}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      style={{ backgroundColor: isEven(index, "#F5F5F5") }}
    >
      {children}
      <TableCell>
        <Grid container alignItems="center">
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              {capitalizeFirstLetter(subscriber.fields.name)}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {capitalizeFirstLetter(subscriber.fields.surname)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
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
            }}
          >
            {subscriber.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {getFormattedData(subscriber.createdTime)}
        </Typography>
      </TableCell>
      {location.pathname !== `/subscribers/${subscriber.id}` && (
        <>
          <TableCell>
            <Button
              color="success"
              variant="contained"
              startIcon={<DetailsIcon style={{ marginLeft: 10 }} />}
              onClick={() => {
                setIdClickedItem(subscriber.id);
                handleSubscriberDetails(subscriber);
                setTextPopupByStatus();
              }}
            />
          </TableCell>
          <TableCell>
            <Button
              aria-label="delete"
              color="error"
              variant="contained"
              startIcon={<DeleteIcon style={{ marginLeft: 10 }} />}
              onClick={() => {
                setOpenConfirmPopup(true);
                setIdClickedItem(subscriber.id);
                setContentPopup({
                  title: "Are you sure you want to remove this subscriber?",
                });
              }}
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default RowSubscriber;