import { createContext, useContext, useState } from "react";

import { InformationModal } from "Modals";

export const InformModalStateContext = createContext();

export const InformationModalContext = ({ children }) => {
  const [isOpenInformationModal, setIsOpenInformationModal] = useState(false);
  const [informationModalProps, setInformationModalProps] = useState({});
  const [informationModalText, setModalText] = useState("");

  const setInformationModalText = (text) => setModalText(text);

  const setInformationModalState = ({
    isOpenInformationModal,
    informationModalProps = {},
  }) => {
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
