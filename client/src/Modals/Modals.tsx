import { ReactNode } from "react";

import { ConfirmModalContext } from "../contexts/ConfirmModalContext";

const Modals = ({ children }: { children: ReactNode }) => (
  <ConfirmModalContext>{children}</ConfirmModalContext>
);

export default Modals;
