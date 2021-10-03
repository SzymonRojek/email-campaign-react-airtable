import { useHistory } from "react-router-dom";
import {
  TableCell,
  TableRow,
  Avatar,
  Grid,
  Typography,
} from "@material-ui/core";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  setTextPopup,
} from "./../../helpers";

const Subscriber = (props) => {
  let { person, index, classes, setOpenPopup, setContentPopup } = props;
  const history = useHistory();

  const handleRowClick = () =>
    person.fields.status === "active"
      ? history.push(`/subscribers/${person.id}`)
      : setOpenPopup(true);

  return (
    <TableRow
      onClick={() => {
        setTextPopup(person.fields.status, person.fields.name, setContentPopup);
        handleRowClick();
      }}
      key={`id-${person.id}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      style={{ backgroundColor: isEven(index) }}
    >
      <TableCell component="th" scope="row">
        {++index}.
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          <Grid item sm={4}>
            <Avatar
              alt={`Image of ${person.fields.name}'s`}
              style={{
                backgroundColor: getStatusColor(person.fields.status),
              }}
            >
              {person.fields.name[0]}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              {person.fields.name}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {person.fields.surname}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {person.fields.email}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{ backgroundColor: getStatusColor(person.fields.status) }}
          >
            {person.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {getFormattedData(person.createdTime)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default Subscriber;
