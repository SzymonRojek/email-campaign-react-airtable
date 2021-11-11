import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 15,
    margin: "100px auto",
    // maxWidth: 1200,
  },
}));

const ContainerTable = ({ children }) => {
  const classes = useStyles();
  return (
    <TableContainer
      component={Paper}
      className={classes.tableContainer}
      elevation={4}
    >
      <Table aria-label="subscribers table">{children}</Table>
    </TableContainer>
  );
};

export default ContainerTable;
