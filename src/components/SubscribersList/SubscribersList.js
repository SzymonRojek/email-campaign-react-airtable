import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import Subscriber from "../Subscriber/Subscriber";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 15,
    margin: "100px auto",
    maxWidth: 950,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
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

const SubscribersList = ({
  dataSubscribers,
  setOpenPopup,
  setContentPopup,
}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table aria-label="subscribers table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>No</TableCell>
            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
            <TableCell className={classes.tableHeaderCell}>Surname</TableCell>
            <TableCell className={classes.tableHeaderCell}>Email</TableCell>
            <TableCell className={classes.tableHeaderCell}>Status</TableCell>
            <TableCell className={classes.tableHeaderCell}>Created</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dataSubscribers &&
            dataSubscribers.map((person, index) => (
              <Subscriber
                key={`id-${person.id}`}
                person={person}
                index={index}
                classes={classes}
                setOpenPopup={setOpenPopup}
                setContentPopup={setContentPopup}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubscribersList;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??
