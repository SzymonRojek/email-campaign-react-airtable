import React, { createContext, useState, useContext } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false);
  const [isOpenInfoPopup, setIsOpenInfoPopup] = useState(false);
  const [text, setText] = useState({});
  const [actionPopup, setActionPopup] = useState(null);
  const openConfirmPopup = () => setIsOpenConfirmPopup(true);
  const openInfoPopup = () => setIsOpenInfoPopup(true);
  const closeConfirmPopup = () => setIsOpenConfirmPopup(false);
  const closeInfoPopup = () => setIsOpenInfoPopup(false);
  const addTextPopup = (text) => setText(text);
  const handleActionPopup = (param) => setActionPopup(param);

  return (
    <PopupContext.Provider
      value={{
        isOpenConfirmPopup,
        isOpenInfoPopup,
        openConfirmPopup,
        openInfoPopup,
        closeConfirmPopup,
        closeInfoPopup,
        text,
        addTextPopup,
        handleActionPopup,
        actionPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
