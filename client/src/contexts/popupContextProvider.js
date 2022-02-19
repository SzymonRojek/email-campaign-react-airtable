import React, { createContext, useState, useContext } from "react";
import { useLocalStorageValue } from "../useLocalStorageValue";

const PopupContext = createContext();

export const PopupContextProvider = ({ children }) => {
  // popups
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

  // login form
  const [statusLog, setStatusLog] = useLocalStorageValue("status", "loadingIn");
  const [isLogIn, setIsLogIn] = useLocalStorageValue("login", false);

  // navigation tabs
  const [tabsValue, setTabsValue] = useState(0);
  const [tabsSubValue, setTabsSubValue] = useState(0);

  // selectedActiveSubscribers in the popup
  const [finalSelectedActiveSubscribers, setFinalSelectedActiveSubscribers] =
    useState(null);

  const contextValues = {
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
    statusLog,
    setStatusLog,
    isLogIn,
    setIsLogIn,
    tabsValue,
    setTabsValue,
    tabsSubValue,
    setTabsSubValue,
    finalSelectedActiveSubscribers,
    setFinalSelectedActiveSubscribers,
  };

  return (
    <PopupContext.Provider value={contextValues}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("PopupContext must be used within a Provider");
  }
  return context;
};
