import PropTypes from "prop-types";
import { TableBody } from "@material-ui/core";

const BodyTable = ({ children }) => <TableBody>{children}</TableBody>;

BodyTable.propTypes = {
  children: PropTypes.array,
};

export default BodyTable;
