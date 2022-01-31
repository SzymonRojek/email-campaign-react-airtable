import PropTypes from "prop-types";

import "./styles.css";

const StyledContainer = ({ children }) => (
  <div className="main-container">
    <div className="children-container">{children}</div>
  </div>
);

StyledContainer.propTypes = {
  children: PropTypes.any,
};

export default StyledContainer;
