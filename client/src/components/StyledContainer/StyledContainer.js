import "./styles.css";

const StyledContainer = ({ children }) => (
  <div className="main-container">
    <div className="children-container">{children}</div>
  </div>
);

export default StyledContainer;
