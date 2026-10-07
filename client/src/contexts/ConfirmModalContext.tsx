import { createContext, ReactNode, useContext, useState } from "react";
import { ConfirmModal } from "Modals";

export interface ConfirmModalText {
  title?: ReactNode;
  description?: ReactNode;
  // the red button, e.g. "Delete"
  confirmLabel?: string;
}

export interface ConfirmModalProps {
  onConfirm?: () => void;
  onClose?: () => void;
}

interface ConfirmModalState {
  isOpenConfirmModal: boolean;
  confirmModalProps?: ConfirmModalProps;
}

interface ConfirmModalContextValue {
  setConfirmModalState: (state: ConfirmModalState) => void;
  isOpenConfirmModal: boolean;
  confirmModalText: ConfirmModalText;
  setConfirmModalText: (text: ConfirmModalText) => void;
  confirmModalProps: ConfirmModalProps;
}

export const ConfirmModalStateContext = createContext<
  ConfirmModalContextValue | undefined
>(undefined);

export const ConfirmModalContext = ({ children }: { children: ReactNode }) => {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps>(
    {}
  );
  const [confirmModalText, setConfirmModalText] = useState<ConfirmModalText>(
    {}
  );

  const setConfirmModalState = ({
    isOpenConfirmModal,
    confirmModalProps = {},
  }: ConfirmModalState) => {
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
