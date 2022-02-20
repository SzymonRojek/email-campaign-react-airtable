import PropTypes from "prop-types";
import { Button } from "@mui/material";

const LogFormButton = ({ label, onClick, className, disabled }) => (
  <Button
    type="submit"
    onClick={onClick}
    className={className}
    disabled={disabled}
  >
    {label}
  </Button>
);

LogFormButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default LogFormButton;
