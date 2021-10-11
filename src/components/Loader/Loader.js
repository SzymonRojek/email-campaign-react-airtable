import "./styles.css";

const Loader = ({ title }) => {
  return (
    <div className="loader-container">
      <div>
        <div className="load"></div>
      </div>
      <p className="loader-text">{title}</p>
    </div>
  );
};

export default Loader;
