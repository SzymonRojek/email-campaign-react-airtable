import PropTypes from "prop-types";
import { Table, TableContainer } from "@material-ui/core";

const style = {
  textAlign: "left",
  paddingLeft: 20,
  letterSpacing: 2,
};

const ContainerTable = ({ subHeading, children }) => (
  <>
    <header>
      <h3 style={style}>{subHeading}</h3>
    </header>
    <TableContainer>
      <Table aria-label="subscribers table">{children}</Table>
    </TableContainer>
  </>
);

ContainerTable.propTypes = {
  children: PropTypes.array.isRequired,
  subHeading: PropTypes.string,
};

ContainerTable.defaultProps = { subHeading: "" };

export default ContainerTable;
