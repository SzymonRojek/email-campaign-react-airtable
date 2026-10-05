import { ReactNode } from "react";

import { ConfirmModalContext } from "../contexts/ConfirmModalContext";
import { InformationModalContext } from "../contexts/InformationModalContext";

const Modals = ({ children }: { children: ReactNode }) => (
  <ConfirmModalContext>
    <InformationModalContext>{children}</InformationModalContext>
  </ConfirmModalContext>
);

export default Modals;
