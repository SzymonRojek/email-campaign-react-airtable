import { TableCell, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { formatMobileNumber } from "helpers";
import { Subscriber } from "types";

const useStyles = makeStyles(() => ({
  cellNo: { width: 25 },
  cell: { wordWrap: "break-word", width: 200 },
}));

const SubscriberDetailsData = ({ subscriber }: { subscriber: Subscriber }) => {
  const classes = useStyles();

  return (
    <TableRow key={`key-${subscriber.id}`}>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {subscriber.fields.email}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {subscriber.fields.profession}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {subscriber.fields.salary}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          +44 {formatMobileNumber(subscriber.fields.telephone)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default SubscriberDetailsData;
