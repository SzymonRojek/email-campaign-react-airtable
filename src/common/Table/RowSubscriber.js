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
  let {
    subscriber,
    index,
    children,
    handlePopup,
    setOpenConfirmPopup,
    setIdClickedSubscriber,
  } = props;
  const classes = useStyles();

  const location = useLocation();

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
          <Grid item sm={4}>
            <Avatar
              alt={`Image of ${subscriber.fields.name}'s`}
              style={{
                backgroundColor: getStatusColor(subscriber.fields.status),
              }}
            >
              {capitalizeFirstLetter(subscriber.fields.name[0])}
            </Avatar>
          </Grid>
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
      {location.pathname === "/subscribers" ||
      location.pathname === "/filtered-status" ? (
        <>
          <TableCell>
            <Button
              color="success"
              variant="contained"
              startIcon={<DetailsIcon />}
              onClick={() => handlePopup(subscriber)}
            />
          </TableCell>
          <TableCell>
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => {
                setOpenConfirmPopup(true);
                setIdClickedSubscriber(subscriber.id);
              }}
            />
          </TableCell>
        </>
      ) : null}
    </TableRow>
  );
};

export default RowSubscriber;
// onClick={() => removeSubscriber(subscriber.id)}
