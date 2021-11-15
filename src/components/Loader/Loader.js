import "./styles.css";

const Loader = ({ title }) => (
  <>
    <div className="loader-container">
      <div className="load"></div>
    </div>

    <div className="text-container">
      <p className="loader-text">{title}</p>

      <div className="dot-container">
        <p className="loader-text">Data</p>
        <div className="dot-flashing"></div>
      </div>
    </div>
  </>
);

export default Loader;
