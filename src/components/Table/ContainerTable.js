import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 15,
    margin: "100px auto",
    // maxWidth: 1200,
  },
}));

const ContainerTable = ({ subHeading, children }) => {
  const classes = useStyles();
  return (
    <>
      <header>
        <h3
          style={{
            textAlign: "left",
            marginBottom: -60,
            color: "#142F43",
            letterSpacing: 2,
          }}
        >
          {subHeading}
        </h3>
      </header>
      <TableContainer
        component={Paper}
        className={classes.tableContainer}
        elevation={4}
      >
        <Table aria-label="subscribers table">{children}</Table>
      </TableContainer>
    </>
  );
};

export default ContainerTable;
