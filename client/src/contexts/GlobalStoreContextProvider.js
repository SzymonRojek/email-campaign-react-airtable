import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocalStorageValue } from "customHooks/useLocalStorageValue";
import { getToken, removeToken, UNAUTHORIZED_EVENT } from "services/authToken";

const GlobalStoreContext = createContext();

export const GlobalStoreContextProvider = ({ children }) => {
  // login form
  const [statusLog, setStatusLog] = useLocalStorageValue("status", "loadingIn");
  const [isLogIn, setIsLogIn] = useLocalStorageValue(
    "login",
    false,
    // logged in only together with a token from the server
    (value) => value && Boolean(getToken())
  );

  // log out - drop the token from the server
  useEffect(() => {
    if (!isLogIn) removeToken();
  }, [isLogIn]);

  // the server rejected the token (expired / invalid)
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLogIn(false);
      setStatusLog("loadingIn");
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [setIsLogIn, setStatusLog]);

  // navigation tabs
  const [tabsValue, setTabsValue] = useState(0);
  const [tabsSubValue, setTabsSubValue] = useState(0);

  // selectedActiveSubscribers in the popup before update or create an email
  // null = nothing chosen in the popup yet (all active subscribers by default)
  const [finalSelectedActiveSubscribers, setFinalSelectedActiveSubscribers] =
    useState(null);

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
