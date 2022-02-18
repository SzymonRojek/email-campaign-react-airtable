import PropTypes from "prop-types";

import "./styles.css";

const Error = ({ titleOne, titleTwo, titleThree }) => (
  <div className="error-content">
    <p className="error-text error-mainText"></p>
    <p className="error-text error-subText">{titleTwo}</p>
    <p className="error-text error-subText">{titleThree}</p>
  </div>
);

Error.propTypes = {
  titleOne: PropTypes.string,
  titleTwo: PropTypes.string,
  titleThree: PropTypes.string,
};

export default Error;
