import "./styles.css";

const LogFormButton = ({ label, onClick, style }) => (
  <button type="submit" className="buttonLog" onClick={onClick} style={style}>
    {label}
  </button>
);

export default LogFormButton;
