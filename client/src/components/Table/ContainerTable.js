import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, Paper } from "@material-ui/core";

const style = {
  textAlign: "left",
  marginBottom: -20,
  color: "#142F43",
  letterSpacing: 2,
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 15,
    margin: "50px auto",
  },
}));

const ContainerTable = ({ subHeading, children }) => {
  const classes = useStyles();
  return (
    <>
      <header>
        <h3 style={style}>{subHeading}</h3>
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

ContainerTable.propTypes = {
  children: PropTypes.array.isRequired,
  subHeading: PropTypes.string,
};

ContainerTable.defaultProps = { subHeading: "" };

export default ContainerTable;
