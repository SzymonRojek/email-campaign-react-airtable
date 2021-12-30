import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { TableCell, TableHead, TableRow } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  tableHeaderCell: {
    minWidth: 100,
    fontWeight: "bold",
    backgroundColor: "#142f43",
    color: "rgb(221, 220, 220)",
  },
}));

const HeadTable = ({ dataHeadTable }) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {dataHeadTable.map((cell, index) => (
          <TableCell key={`i-${index}`} className={classes.tableHeaderCell}>
            {cell}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

HeadTable.propTypes = {
  dataHeadTable: PropTypes.arrayOf(PropTypes.string),
};

export default HeadTable;
