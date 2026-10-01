import { ReactNode } from "react";

import "./styles.css";

const StyledMainContent = ({ children }: { children: ReactNode }) => (
  <main className="main-container">{children}</main>
);

export default StyledMainContent;
