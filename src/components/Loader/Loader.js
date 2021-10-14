import "./styles.css";

const Loader = ({ title }) => (
  <div className="loader-container">
    <div className="load"></div>
    <p className="loader-text">{title}</p>
  </div>
);

export default Loader;
