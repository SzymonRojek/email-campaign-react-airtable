import { ConfirmModalContext } from "../contexts/ConfirmModalContext";
import { InformationModalContext } from "../contexts/InformationModalContext";

const Modals = ({ children }) => (
  <>
    <ConfirmModalContext>
      <InformationModalContext>{children}</InformationModalContext>
    </ConfirmModalContext>
  </>
);

export default Modals;
