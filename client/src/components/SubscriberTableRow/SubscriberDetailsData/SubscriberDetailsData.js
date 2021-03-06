import PropTypes from "prop-types";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { formatMobileNumber } from "helpers";

const useStyles = makeStyles(() => ({
  cellNo: { width: 25 },
  cell: { wordWrap: "break-word", width: 200 },
}));

const SubscriberDetailsData = ({ subscriber }) => {
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

SubscriberDetailsData.propTypes = {
  subscriber: PropTypes.shape({
    id: PropTypes.string,
    createdTime: PropTypes.string,
    fields: PropTypes.shape({
      status: PropTypes.string,
      name: PropTypes.string,
      surname: PropTypes.string,
      profession: PropTypes.string,
      email: PropTypes.string,
      salary: PropTypes.string,
      telephone: PropTypes.string,
    }).isRequired,
  }),
  index: PropTypes.number,
};

export default SubscriberDetailsData;
