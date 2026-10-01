import "./styles.css";

interface LoaderProps {
  title?: string;
}

const Loader = ({ title }: LoaderProps) => (
  <div className="loader-container">
    <div className="load"></div>

    <div className="text-container">
      <div className="dot-container">
        <p className="loader-text">{title}</p>
        <div className="dot-flashing"></div>
      </div>
    </div>
  </div>
);

export default Loader;
