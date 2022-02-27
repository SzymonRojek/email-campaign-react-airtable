import PropTypes from "prop-types";

import "./styles.css";

const Error = ({ error }) => {
  return (
    <div className="error-content">
      <p className="error-text error-mainText">{error}</p>
    </div>
  );
};

Error.propTypes = {
  titleOne: PropTypes.string,
  titleTwo: PropTypes.string,
  titleThree: PropTypes.string,
};

export default Error;
