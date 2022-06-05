import React, { createContext, useState, useContext } from "react";
import { useLocalStorageValue } from "customHooks/useLocalStorageValue";

const GlobalStoreContext = createContext();

export const GlobalStoreContextProvider = ({ children }) => {
  // login form
  const [statusLog, setStatusLog] = useLocalStorageValue("status", "loadingIn");
  const [isLogIn, setIsLogIn] = useLocalStorageValue("login", false);

  // navigation tabs
  const [tabsValue, setTabsValue] = useState(0);
  const [tabsSubValue, setTabsSubValue] = useState(0);

  // selectedActiveSubscribers in the popup before update or create an email
  const [finalSelectedActiveSubscribers, setFinalSelectedActiveSubscribers] =
    useState([]);

  const contextValues = {
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
    <GlobalStoreContext.Provider value={contextValues}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStoreContext = () => {
  const context = useContext(GlobalStoreContext);
  if (context === undefined) {
    throw new Error("GlobalStoreContext must be used within a Provider");
  }
  return context;
};
