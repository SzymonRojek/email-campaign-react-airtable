import "./styles.css";

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div className="error-content">
      <p className="error-text error-mainText">{error}</p>
    </div>
  );
};

export default Error;
