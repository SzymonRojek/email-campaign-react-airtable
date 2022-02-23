import { createContext, useContext, useState } from "react";
import { ConfirmModal } from "Modals";

export const ConfirmModalStateContext = createContext();

export const ConfirmModalContext = ({ children }) => {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({});
  const [confirmModalText, setconfirmModalText] = useState("");

  const setConfirmModalText = (text) => setconfirmModalText(text);

  const setConfirmModalState = ({
    isOpenConfirmModal,
    confirmModalProps = {},
  }) => {
    setIsOpenConfirmModal(isOpenConfirmModal);
    setConfirmModalProps(confirmModalProps);
  };

  const contextValues = {
    setConfirmModalState,
    isOpenConfirmModal,
    confirmModalText,
    setConfirmModalText,
    confirmModalProps,
  };

  return (
    <ConfirmModalStateContext.Provider value={contextValues}>
      <ConfirmModal />
      {children}
    </ConfirmModalStateContext.Provider>
  );
};

export const useConfirmModalState = () => {
  const context = useContext(ConfirmModalStateContext);
  if (context === undefined) {
    throw new Error("ConfirmModalContext must be used within a Provider");
  }
  return context;
};
