import PropTypes from "prop-types";
import { Button } from "@mui/material";

const LogFormButton = ({ label, onClick, className }) => (
  <Button type="submit" onClick={onClick} className={className}>
    {label}
  </Button>
);

LogFormButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.object,
};

export default LogFormButton;
