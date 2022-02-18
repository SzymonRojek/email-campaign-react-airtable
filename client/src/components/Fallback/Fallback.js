import "./styles.css";

const Fallback = ({ error, componentStack, resetErrorBoundary }) => {
  return (
    <div className="error-content">
      <p className="error-text error-mainText">{error?.message}</p>
      {/* <p className="error-text error-subText">{titleTwo}</p>
      <p className="error-text error-subText">{titleThree}</p> */}
    </div>
  );
};

export default Fallback;
