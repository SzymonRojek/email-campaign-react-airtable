import "./styles.css";

const Loader = ({ title }) => (
  <div className="loader-container">
    <div className="load"></div>
    <p className="loader-text" style={{ textAlign: "center" }}>
      {title}
    </p>
  </div>
);

export default Loader;
