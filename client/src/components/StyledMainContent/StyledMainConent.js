import PropTypes from "prop-types";

import "./styles.css";

const StyledMainContent = ({ children }) => (
  <main className="main-container">{children}</main>
);

StyledMainContent.propTypes = {
  children: PropTypes.any,
};

export default StyledMainContent;
