import { makeStyles } from "@material-ui/core/styles";
import { TableCell, TableHead, TableRow } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
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

export default HeadTable;
