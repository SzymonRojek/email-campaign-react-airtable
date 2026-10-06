import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorageValue } from "customHooks/useLocalStorageValue";
import { getToken, removeToken, UNAUTHORIZED_EVENT } from "services/authToken";
import { Subscriber } from "types";

interface GlobalStoreContextValue {
  isLogIn: boolean;
  setIsLogIn: Dispatch<SetStateAction<boolean>>;
  finalSelectedActiveSubscribers: Subscriber[] | null;
  setFinalSelectedActiveSubscribers: Dispatch<
    SetStateAction<Subscriber[] | null>
  >;
}

const GlobalStoreContext = createContext<GlobalStoreContextValue | undefined>(
  undefined
);

export const GlobalStoreContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLogIn, setIsLogIn] = useLocalStorageValue<boolean>(
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
    const handleUnauthorized = () => setIsLogIn(false);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [setIsLogIn]);

  // selectedActiveSubscribers in the popup before update or create an email
  // null = nothing chosen in the popup yet (all active subscribers by default)
  const [finalSelectedActiveSubscribers, setFinalSelectedActiveSubscribers] =
    useState<Subscriber[] | null>(null);

  const contextValues = {
    isLogIn,
    setIsLogIn,
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
