import PropTypes from "prop-types";

import "./styles.css";

const Loader = ({ title }) => (
  <div className="loader-container">
    <div className="load"></div>

    <div className="text-container">
      <p className="loader-text">{title} Data</p>

      <div className="dot-container">
        <p className="loader-text">loading</p>
        <div className="dot-flashing"></div>
      </div>
    </div>
  </div>
);

Loader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Loader;