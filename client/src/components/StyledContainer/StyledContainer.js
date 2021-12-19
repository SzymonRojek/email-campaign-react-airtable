import { Container } from "@material-ui/core";

import "./styles.css";

const StyledContainer = ({ children }) => (
  <Container className="styled-container">{children}</Container>
);

export default StyledContainer;
