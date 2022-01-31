import PropTypes from "prop-types";

import "./styles.css";

const LogFormButton = ({ label, onClick, style }) => (
  <button type="submit" className="buttonLog" onClick={onClick} style={style}>
    {label}
  </button>
);

LogFormButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default LogFormButton;
