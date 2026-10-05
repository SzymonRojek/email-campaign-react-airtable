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
import { StatusLog, Subscriber } from "types";

interface GlobalStoreContextValue {
  statusLog: StatusLog;
  setStatusLog: Dispatch<SetStateAction<StatusLog>>;
  isLogIn: boolean;
  setIsLogIn: Dispatch<SetStateAction<boolean>>;
  tabsValue: number;
  setTabsValue: Dispatch<SetStateAction<number>>;
  tabsSubValue: number;
  setTabsSubValue: Dispatch<SetStateAction<number>>;
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
  // login form
  const [statusLog, setStatusLog] = useLocalStorageValue<StatusLog>(
    "status",
    "loadingIn"
  );
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
    useState<Subscriber[] | null>(null);

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
