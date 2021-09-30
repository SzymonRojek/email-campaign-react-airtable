import moment from "moment";

import { TableCell, TableRow, Avatar, Grid } from "@material-ui/core";

const isEven = (index) => (index % 2 ? "#F5F5F5" : "");

const getFormattedData = (data) => {
  const time = data.slice(0, 10);
  return moment(time).format("YYYY/MM/DD");
};

const styledStatus = {
  active: {
    color: "white",
    backgroundColor: "#6aec6a",
    padding: 5,
    borderRadius: 2,
  },
  deactive: {
    color: "white",
    backgroundColor: "#ec4f4f",
    padding: 5,
    borderRadius: 2,
  },
};

const Subscriber = ({ person, index, classes }) => {
  return (
    <TableRow
      key={`key-${index}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      style={{ backgroundColor: isEven(index) }}
      className={classes.hover}
    >
      <TableCell component="th" scope="row">
        {++index}.
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          <Grid item sm={4}>
            <Avatar alt={`Image of ${person.fields.name}'s`}>
              {person.fields.name[0]}
            </Avatar>
          </Grid>
          <Grid item>{person.fields.name}</Grid>
        </Grid>
      </TableCell>
      <TableCell>{person.fields.surname}</TableCell>
      <TableCell>{person.fields.email}</TableCell>
      <TableCell>
        <span
          style={
            person.fields.status ? styledStatus.active : styledStatus.deactive
          }
        >
          {" "}
          {person.fields.status ? "active" : "deactive"}
        </span>
      </TableCell>
      <TableCell>{getFormattedData(person.createdTime)}</TableCell>
    </TableRow>
  );
};

export default Subscriber;
