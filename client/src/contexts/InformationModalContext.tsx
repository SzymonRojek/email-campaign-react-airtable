import { createContext, ReactNode, useContext, useState } from "react";

import { InformationModal } from "Modals";

export interface InformationModalText {
  title?: ReactNode;
  additionalText?: ReactNode;
  message?: ReactNode;
}

export interface InformationModalProps {
  // "error" shows the title in red
  colorButton?: "success" | "error";
  onClose?: () => void;
}

interface InformationModalState {
  isOpenInformationModal: boolean;
  informationModalProps?: InformationModalProps;
}

interface InformationModalContextValue {
  setInformationModalState: (state: InformationModalState) => void;
  isOpenInformationModal: boolean;
  informationModalText: InformationModalText;
  setInformationModalText: (text: InformationModalText) => void;
  informationModalProps: InformationModalProps;
}

export const InformModalStateContext = createContext<
  InformationModalContextValue | undefined
>(undefined);

export const InformationModalContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpenInformationModal, setIsOpenInformationModal] = useState(false);
  const [informationModalProps, setInformationModalProps] =
    useState<InformationModalProps>({});
  const [informationModalText, setInformationModalText] =
    useState<InformationModalText>({});

  const setInformationModalState = ({
    isOpenInformationModal,
    informationModalProps = {},
  }: InformationModalState) => {
    setIsOpenInformationModal(isOpenInformationModal);
    setInformationModalProps(informationModalProps);
  };

  const contextValues = {
    setInformationModalState,
    isOpenInformationModal,
    informationModalText,
    setInformationModalText,
    informationModalProps,
  };

  return (
    <InformModalStateContext.Provider value={contextValues}>
      <InformationModal />
      {children}
    </InformModalStateContext.Provider>
  );
};

export const useInformationModalState = () => {
  const context = useContext(InformModalStateContext);
  if (context === undefined) {
    throw new Error("InformModalContext must be used within a Provider");
  }
  return context;
};
