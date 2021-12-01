import PropTypes from "prop-types";

import "./styles.css";

const Error = ({ titleOne, titleTwo, titleThree }) => (
  <div className="error-container">
    <p className="error-text error-mainText">{titleOne}</p>
    <p className="error-text error-subText">{titleTwo}</p>
    <p className="error-text error-subText">{titleThree}</p>
  </div>
);

Error.propTypes = {
  titleOne: PropTypes.string.isRequired,
  titleTwo: PropTypes.string.isRequired,
  titleThree: PropTypes.string.isRequired,
};

export default Error;
