import PropTypes from "prop-types";

const LogFormButton = ({ label, onClick, className }) => (
  <button type="submit" onClick={onClick} className={className}>
    {label}
  </button>
);

LogFormButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default LogFormButton;
