import {
  TableCell,
  TableRow,
  Avatar,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { isEven, getFormattedData, getStatusColor } from "./../../../helpers";

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
  let { subscriber, index, onClick, children } = props;
  const classes = useStyles();

  return (
    <TableRow
      onClick={onClick}
      key={`id-${subscriber.id}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      style={{ backgroundColor: isEven(index) }}
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
              {subscriber.fields.name[0]}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              {subscriber.fields.name}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {subscriber.fields.surname}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {subscriber.fields.email}
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
    </TableRow>
  );
};

export default RowSubscriber;
