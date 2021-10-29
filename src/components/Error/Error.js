import "./styles.css";

const Error = ({ titleOne, titleTwo, titleThree }) => (
  <div className="error-container" style={{ textAlign: "center" }}>
    <div></div>
    <p className="error-text error-mainText">{titleOne}</p>
    <p className="error-text error-subText">{titleTwo}</p>
    <p className="error-text error-subText">{titleThree}</p>
  </div>
);

export default Error;
