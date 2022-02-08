import PropTypes from "prop-types";

import "./styles.css";
import { StyledMainContent } from "../../StyledMainContent";

const Error = ({ titleOne, titleTwo, titleThree }) => (
  <StyledMainContent>
    <div className="error-content">
      <p className="error-text error-mainText">{titleOne}</p>
      <p className="error-text error-subText">{titleTwo}</p>
      <p className="error-text error-subText">{titleThree}</p>
    </div>
  </StyledMainContent>
);

Error.propTypes = {
  titleOne: PropTypes.string,
  titleTwo: PropTypes.string,
  titleThree: PropTypes.string,
};

export default Error;
